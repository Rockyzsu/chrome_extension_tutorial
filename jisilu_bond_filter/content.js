(function() {
  var STORAGE_KEY_HIDDEN = 'jisilu_bond_filter_hidden';
  var STORAGE_KEY_SHOW = 'jisilu_bond_filter_show';
  var STORAGE_KEY_SINCREASE_A = 'jisilu_bond_filter_sincrease_a';
  var STORAGE_KEY_SINCREASE_B = 'jisilu_bond_filter_sincrease_b';
  var BOND_NM_COLUMN = 1;
  var SINCREASE_RT_COLUMN = 6;
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

  function getSincreaseA() {
    try { return localStorage.getItem(STORAGE_KEY_SINCREASE_A) || ''; } catch(e) {}
    return '';
  }

  function getSincreaseB() {
    try { return localStorage.getItem(STORAGE_KEY_SINCREASE_B) || ''; } catch(e) {}
    return '';
  }

  function saveSincreaseA(val) {
    try { localStorage.setItem(STORAGE_KEY_SINCREASE_A, val); } catch(e) {}
  }

  function saveSincreaseB(val) {
    try { localStorage.setItem(STORAGE_KEY_SINCREASE_B, val); } catch(e) {}
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

        // Apply 正股涨跌幅 range filter if values are set
        if (row.style.display !== 'none') {
          var aStr = getSincreaseA();
          var bStr = getSincreaseB();
          if (aStr || bStr) {
            var cell = cells[SINCREASE_RT_COLUMN];
            if (cell) {
              var text = cell.textContent.trim().replace('%', '');
              var val = parseFloat(text);
              if (isNaN(val)) {
                row.style.display = 'none';
              } else {
                if (aStr && val < parseFloat(aStr)) row.style.display = 'none';
                if (bStr && val > parseFloat(bStr)) row.style.display = 'none';
              }
            }
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
      btn1.textContent = '移除强赎转债：关';
      btn1.style.cssText = 'margin-left: 20px; padding: 4px 12px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
      btn1.onclick = function() {
        var isOn = btn1.textContent === '移除强赎转债：开';
        if (isOn) {
          showAllBonds();
          btn1.textContent = '移除强赎转债：关';
          btn1.style.backgroundColor = '#d9534f';
        } else {
          hideWarningBonds();
          document.getElementById('jisilu-nobuy-btn').textContent = '显示不强赎：关';
          document.getElementById('jisilu-nobuy-btn').style.backgroundColor = '#d9534f';
          btn1.textContent = '移除强赎转债：开';
          btn1.style.backgroundColor = '#5cb85c';
        }
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
      btn2.textContent = '显示不强赎：关';
      btn2.style.cssText = 'margin-left: 10px; padding: 4px 12px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
      btn2.onclick = function() {
        var isOn = btn2.textContent === '显示不强赎：开';
        if (isOn) {
          showAllBonds();
          btn2.textContent = '显示不强赎：关';
          btn2.style.backgroundColor = '#d9534f';
        } else {
          showNoRedeemBonds();
          document.getElementById('jisilu-filter-btn').textContent = '移除强赎转债：关';
          document.getElementById('jisilu-filter-btn').style.backgroundColor = '#d9534f';
          btn2.textContent = '显示不强赎：开';
          btn2.style.backgroundColor = '#5cb85c';
        }
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

  function createSincreaseFilter() {
    var existingContainer = document.querySelector('#jisilu-sincrease-container');
    if (!existingContainer) {
      var container = document.querySelector('#topic_cb .clearfix .pull-left');
      if (!container) return;

      var wrapper = document.createElement('span');
      wrapper.id = 'jisilu-sincrease-container';
      wrapper.style.cssText = 'margin-left: 10px; background-color: #d9534f; padding: 2px 6px; border-radius: 3px;';

      var label = document.createElement('span');
      label.textContent = '正股涨跌';
      label.style.cssText = 'font-size: 12px; margin-right: 3px; color: #fff;';

      var inputA = document.createElement('input');
      inputA.type = 'text';
      inputA.id = 'jisilu-sincrease-a';
      inputA.value = getSincreaseA();
      inputA.style.cssText = 'width: 38px; height: 22px; font-size: 12px; text-align: right; padding: 0 2px; border: none; border-radius: 3px;';
      inputA.placeholder = '';

      var spanTo = document.createElement('span');
      spanTo.textContent = '～';
      spanTo.style.cssText = 'font-size: 12px; margin: 0 2px; color: #fff;';

      var inputB = document.createElement('input');
      inputB.type = 'text';
      inputB.id = 'jisilu-sincrease-b';
      inputB.value = getSincreaseB();
      inputB.style.cssText = 'width: 38px; height: 22px; font-size: 12px; text-align: right; padding: 0 2px; border: none; border-radius: 3px;';
      inputB.placeholder = '';

      function applyFilter() {
        var a = document.getElementById('jisilu-sincrease-a').value.trim();
        var b = document.getElementById('jisilu-sincrease-b').value.trim();
        saveSincreaseA(a);
        saveSincreaseB(b);
        restoreHiddenRows();
      }

      inputA.addEventListener('input', applyFilter);
      inputB.addEventListener('input', applyFilter);

      wrapper.appendChild(label);
      wrapper.appendChild(inputA);
      wrapper.appendChild(spanTo);
      wrapper.appendChild(inputB);
      container.appendChild(wrapper);
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

  function showAllBonds() {
    try {
      saveHiddenBonds([]);
      saveShowBonds([]);
      
      var table = document.querySelector('#flex_cb');
      if (!table) return;
      
      var allRows = table.querySelectorAll('tbody tr');
      for (var i = 0; i < allRows.length; i++) {
        allRows[i].style.display = '';
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

  function createExportButton() {
    var existingBtn = document.querySelector('#jisilu-export-btn');
    if (!existingBtn) {
      var btn = document.createElement('button');
      btn.id = 'jisilu-export-btn';
      btn.textContent = '导出Excel';
      btn.style.cssText = 'margin-left: 10px; padding: 4px 12px; background-color: #006798; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
      btn.onclick = exportToExcel;

      var container = document.querySelector('#topic_cb .clearfix .pull-left');
      if (container) {
        var span = document.createElement('span');
        span.style.marginLeft = '10px';
        span.appendChild(btn);
        container.appendChild(span);
      }
    }
  }

  function exportToExcel() {
    try {
      var table = document.querySelector('#flex_cb');
      if (!table) return;

      var headers = [];
      var headerRows = table.querySelectorAll('thead tr');
      var headerRow = null;
      if (headerRows.length >= 2) {
        headerRow = headerRows[1];
      } else if (headerRows.length === 1) {
        headerRow = headerRows[0];
      }
      if (headerRow) {
        var headerCells = headerRow.querySelectorAll('th, td');
        for (var i = 0; i < headerCells.length; i++) {
          headers.push(headerCells[i].textContent.trim());
        }
      }

      var allRows = table.querySelectorAll('tbody tr');
      var dataRows = [];
      for (var i = 0; i < allRows.length; i++) {
        var row = allRows[i];
        if (row.style.display === 'none') continue;
        var cells = row.querySelectorAll('td');
        var rowData = [];
        for (var j = 0; j < cells.length; j++) {
          rowData.push(cells[j].textContent.trim());
        }
        dataRows.push(rowData);
      }

      var html = '<table>';
      if (headers.length > 0) {
        html += '<thead><tr>';
        for (var i = 0; i < headers.length; i++) {
          html += '<th>' + escapeHtml(headers[i]) + '</th>';
        }
        html += '</tr></thead>';
      }
      html += '<tbody>';
      for (var i = 0; i < dataRows.length; i++) {
        html += '<tr>';
        for (var j = 0; j < dataRows[i].length; j++) {
          html += '<td>' + escapeHtml(dataRows[i][j]) + '</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';

      var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '可转债数据_' + new Date().toISOString().slice(0, 10) + '.xls';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {}
  }

  function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var autoRefreshTimer = null;
  var isAutoRefreshing = false;

  function callPageFunction(fnName) {
    chrome.runtime.sendMessage({ type: 'callPageFunction', fnName: fnName });
  }

  function createAutoRefreshButton() {
    var existingBtn = document.querySelector('#jisilu-autorefresh-btn');
    if (!existingBtn) {
      var btn = document.createElement('button');
      btn.id = 'jisilu-autorefresh-btn';
      btn.textContent = '自动刷新：关';
      btn.style.cssText = 'margin-left: 10px; padding: 4px 12px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
      btn.onclick = function() {
        if (isAutoRefreshing) {
          clearInterval(autoRefreshTimer);
          autoRefreshTimer = null;
          isAutoRefreshing = false;
          btn.textContent = '自动刷新：关';
          btn.style.backgroundColor = '#d9534f';
        } else {
          isAutoRefreshing = true;
          btn.textContent = '自动刷新：开';
          btn.style.backgroundColor = '#5cb85c';
          callPageFunction('reloadConvertBondSearch');
          autoRefreshTimer = setInterval(function() {
            callPageFunction('reloadConvertBondSearch');
          }, 10000);
        }
      };

      var container = document.querySelector('#topic_cb .clearfix .pull-left');
      if (container) {
        var span = document.createElement('span');
        span.style.marginLeft = '10px';
        span.appendChild(btn);
        container.appendChild(span);
      }
    }
  }

  function init() {
    var timer = setInterval(function() {
      var table = document.querySelector('#flex_cb');
      if (table && table.querySelector('tbody tr')) {
        clearInterval(timer);
        createFilterButtons();
        createSincreaseFilter();
        createExportButton();
        createAutoRefreshButton();
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