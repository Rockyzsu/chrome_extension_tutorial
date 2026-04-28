(function() {
  var STORAGE_KEY_HIDDEN = 'jisilu_bond_filter_hidden';
  var STORAGE_KEY_SHOW = 'jisilu_bond_filter_show';
  var BOND_NM_COLUMN = 1;
  var isRunning = true;

  function getHiddenBonds() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY_HIDDEN);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch(e) {}
    return [];
  }

  function getShowBonds() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY_SHOW);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch(e) {}
    return [];
  }

  function saveHiddenBonds(bondIds) {
    try {
      localStorage.setItem(STORAGE_KEY_HIDDEN, JSON.stringify(bondIds));
    } catch(e) {}
  }

  function saveShowBonds(bondIds) {
    try {
      localStorage.setItem(STORAGE_KEY_SHOW, JSON.stringify(bondIds));
    } catch(e) {}
  }

  function restoreHiddenRows() {
    if (!isRunning) return;
    
    try {
      var hiddenIds = getHiddenBonds();
      var showIds = getShowBonds();
      var table = document.querySelector('#flex_cb');
      if (!table) return;

      var allRows = table.querySelectorAll('tbody tr');

      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        var cells = row.querySelectorAll('td');
        if (!cells[BOND_NM_COLUMN]) continue;
        
        var bondNmCell = cells[BOND_NM_COLUMN];
        var bondId = getBondName(bondNmCell);
        
        if (!bondId) continue;
        
        // If we have showIds (不强赎过滤), only show those
        if (showIds.length > 0) {
          if (showIds.indexOf(bondId) === -1) {
            row.style.display = 'none';
          } else {
            row.style.display = '';
          }
        } else if (hiddenIds.length > 0) {
          if (hiddenIds.indexOf(bondId) !== -1) {
            row.style.display = 'none';
          }
        }
      }
    } catch(e) {}
  }

  function getBondName(bondNmCell) {
    var bondLink = bondNmCell.querySelector('a');
    if (bondLink) {
      return bondLink.textContent.trim();
    }
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = bondNmCell.innerHTML;
    var spans = tempDiv.querySelectorAll('span');
    for (var s = 0; s < spans.length; s++) {
      if (spans[s].textContent.trim() === '!') {
        spans[s].remove();
      }
    }
    return tempDiv.textContent.trim();
  }

  function createFilterButtons() {
    var existingBtn1 = document.querySelector('#jisilu-filter-btn');
    if (!existingBtn1) {
      var btn1 = document.createElement('button');
      btn1.id = 'jisilu-filter-btn';
      btn1.textContent = '过滤警示转债';
      btn1.style.cssText = 'margin-left: 20px; padding: 4px 12px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
      btn1.onclick = function() {
        hideWarningBonds();
        document.getElementById('jisilu-nobuy-btn').textContent = '不强赎';
        document.getElementById('jisilu-nobuy-btn').style.backgroundColor = '#d9534f';
        btn1.textContent = '已过滤';
        btn1.style.backgroundColor = '#5cb85c';
      };

      var container = document.querySelector('#topic_cb .clearfix .pull-left');
      if (container) {
        var span1 = document.createElement('span');
        span1.style.marginLeft = '25px';
        span1.appendChild(btn1);
        container.appendChild(span1);
      }
    }

    var existingBtn2 = document.querySelector('#jisilu-nobuy-btn');
    if (!existingBtn2) {
      var btn2 = document.createElement('button');
      btn2.id = 'jisilu-nobuy-btn';
      btn2.textContent = '不强赎';
      btn2.style.cssText = 'margin-left: 10px; padding: 4px 12px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
      btn2.onclick = function() {
        showNoRedeemBonds();
        document.getElementById('jisilu-filter-btn').textContent = '过滤警示转债';
        document.getElementById('jisilu-filter-btn').style.backgroundColor = '#d9534f';
        btn2.textContent = '已筛选';
        btn2.style.backgroundColor = '#5cb85c';
      };

      var container = document.querySelector('#topic_cb .clearfix .pull-left');
      if (container) {
        var span2 = document.createElement('span');
        span2.style.marginLeft = '10px';
        span2.appendChild(btn2);
        container.appendChild(span2);
      }
    }
  }

  function hideWarningBonds() {
    try {
      var table = document.querySelector('#flex_cb');
      if (!table) return;

      // Clear show filter
      saveShowBonds([]);
      
      var allRows = table.querySelectorAll('tbody tr');
      var warningBonds = [];

      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        var cells = row.querySelectorAll('td');
        if (!cells[BOND_NM_COLUMN]) continue;
        
        var bondNmCell = cells[BOND_NM_COLUMN];
        var spans = bondNmCell.querySelectorAll('span');
        
        for (var j = 0; j < spans.length; j++) {
          var span = spans[j];
          var style = span.getAttribute('style') || '';
          var text = span.textContent || '';
          
          if (text.trim() === '!') {
            if (style.indexOf('color:red') !== -1 || style.indexOf('color:#FFA500') !== -1) {
              var bondId = getBondName(bondNmCell);
              if (bondId) {
                warningBonds.push(bondId);
                row.style.display = 'none';
              }
              break;
            }
          }
        }
      }

      if (warningBonds.length > 0) {
        saveHiddenBonds(warningBonds);
      }
    } catch(e) {}
  }

  function showNoRedeemBonds() {
    try {
      var table = document.querySelector('#flex_cb');
      if (!table) return;

      // Clear hidden filter
      saveHiddenBonds([]);
      
      var allRows = table.querySelectorAll('tbody tr');
      var noRedeemBonds = [];

      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        var cells = row.querySelectorAll('td');
        if (!cells[BOND_NM_COLUMN]) continue;
        
        var bondNmCell = cells[BOND_NM_COLUMN];
        var spans = bondNmCell.querySelectorAll('span');
        var isNoRedeem = false;
        
        for (var j = 0; j < spans.length; j++) {
          var span = spans[j];
          var style = span.getAttribute('style') || '';
          var text = span.textContent || '';
          
          if (text.trim() === '!' && style.indexOf('color:#A9A9A9') !== -1) {
            isNoRedeem = true;
            break;
          }
        }
        
        if (isNoRedeem) {
          var bondId = getBondName(bondNmCell);
          if (bondId) {
            noRedeemBonds.push(bondId);
          }
        } else {
          row.style.display = 'none';
        }
      }

      if (noRedeemBonds.length > 0) {
        saveShowBonds(noRedeemBonds);
      }
    } catch(e) {}
  }

  function startObserver() {
    setInterval(function() {
      restoreHiddenRows();
    }, 1500);
  }

  function init() {
    var timer = setInterval(function() {
      var table = document.querySelector('#flex_cb');
      if (table && table.querySelector('tbody tr')) {
        clearInterval(timer);
        createFilterButtons();
        restoreHiddenRows();
        startObserver();
      }
    }, 500);
    setTimeout(function() { clearInterval(timer); }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();