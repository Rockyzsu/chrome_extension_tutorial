(function() {
  var STORAGE_KEY = 'jisilu_bond_filter_hidden';
  var BOND_NM_COLUMN = 1;
  var isRunning = true;

  function getHiddenBonds() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch(e) {}
    return [];
  }

  function saveHiddenBonds(bondIds) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bondIds));
    } catch(e) {}
  }

  function restoreHiddenRows() {
    if (!isRunning) return;
    
    try {
      var hiddenIds = getHiddenBonds();
      var table = document.querySelector('#flex_cb');
      if (!table || hiddenIds.length === 0) return;

      var allRows = table.querySelectorAll('tbody tr');

      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        var cells = row.querySelectorAll('td');
        if (!cells[BOND_NM_COLUMN]) continue;
        
        var bondNmCell = cells[BOND_NM_COLUMN];
        var bondLink = bondNmCell.querySelector('a');
        var bondId;
        
        if (bondLink) {
          bondId = bondLink.textContent.trim();
        } else {
          // Get text content but exclude the "!" spans
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = bondNmCell.innerHTML;
          var spans = tempDiv.querySelectorAll('span');
          for (var s = 0; s < spans.length; s++) {
            if (spans[s].textContent.trim() === '!') {
              spans[s].remove();
            }
          }
          bondId = tempDiv.textContent.trim();
        }
        
        if (bondId && hiddenIds.indexOf(bondId) !== -1) {
          row.style.display = 'none';
        }
      }
    } catch(e) {}
  }

  function createFilterButton() {
    var existingBtn = document.querySelector('#jisilu-filter-btn');
    if (existingBtn) return;

    var btn = document.createElement('button');
    btn.id = 'jisilu-filter-btn';
    btn.textContent = '过滤警示转债';
    btn.style.cssText = 'margin-left: 20px; padding: 4px 12px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
    btn.onclick = function() {
      hideMatchingRows();
      btn.textContent = '已过滤';
      btn.style.backgroundColor = '#5cb85c';
    };

    var container = document.querySelector('#topic_cb .clearfix .pull-left');
    if (container) {
      var span = document.createElement('span');
      span.style.marginLeft = '25px';
      span.appendChild(btn);
      container.appendChild(span);
    }
  }

  function hideMatchingRows() {
    try {
      var table = document.querySelector('#flex_cb');
      if (!table) return;

      var allRows = table.querySelectorAll('tbody tr');
      var warningBonds = [];

      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        var cells = row.querySelectorAll('td');
        if (!cells[BOND_NM_COLUMN]) continue;
        
        var bondNmCell = cells[BOND_NM_COLUMN];
        
        // Get all spans in the cell
        var spans = bondNmCell.querySelectorAll('span');
        
        for (var j = 0; j < spans.length; j++) {
          var span = spans[j];
          var style = span.getAttribute('style') || '';
          var text = span.textContent || '';
          
          // Check if this span contains just "!" with red or orange color
          if (text.trim() === '!') {
            if (style.indexOf('color:red') !== -1 || style.indexOf('color:#FFA500') !== -1) {
              // Get bond name - either from <a> tag or from text
              var bondLink = bondNmCell.querySelector('a');
              var bondId;
              
              if (bondLink) {
                bondId = bondLink.textContent.trim();
              } else {
                // Clone the cell and remove the warning spans to get bond name
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = bondNmCell.innerHTML;
                var warningSpans = tempDiv.querySelectorAll('span');
                for (var s = 0; s < warningSpans.length; s++) {
                  if (warningSpans[s].textContent.trim() === '!') {
                    warningSpans[s].remove();
                  }
                }
                bondId = tempDiv.textContent.trim();
              }
              
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
    } catch(e) {
      console.log('Error:', e);
    }
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
        createFilterButton();
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