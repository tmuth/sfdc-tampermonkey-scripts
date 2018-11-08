// ==UserScript==
// @name         Copy ESR Details to Clipboard
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Tyler Muth - tmuth@splunk.com
// @match        https://splunk.my.salesforce.com/00O0*
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/tmuth/sfdc-tampermonkey-scripts/master/copy-esr-details.js
// @downloadURL  https://raw.githubusercontent.com/tmuth/sfdc-tampermonkey-scripts/master/copy-esr-details.js
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    function getBaseUrl() {
        var re = new RegExp(/^.*\//);
        return re.exec(window.location.href);
    }

    function getCellByHeaderName(el,search){
        var indexId = $(el).parents('table.tabularReportTable').find('th:contains('+search+')').index();
        indexId = indexId + 1;
        return $(el).parents('tr').find('td:nth-child('+indexId+')');
    }
    function copyEsrTextToClipboard(el){
        var url = getBaseUrl();
        var esrLink = getCellByHeaderName(el,'Support Request Name').find('a').attr('href') ;
        esrLink = url+esrLink;

        var oppName = getCellByHeaderName(el,'Opportunity Name').find('a').prop('innerHTML');

        var amount = getCellByHeaderName(el,'Amount').html();
        amount = amount.replace('USD ','$');
        var regex = /\.\d\d$/i;
        amount = amount.replace(regex,'');
        
        // This format can be anything that we want. \n will give newlines. 
        var outText = "ESR ~ " + oppName + " ~ " + amount + " ~ " +esrLink;
        GM_setClipboard (outText);

    }

    if($('h1:contains(ESR)').length > 0){
        $("a:contains(SSSR-)").parent("td").append('<span class="copyESRtoClipboard"> [copy] </span>');

        $(".copyESRtoClipboard").click(function(){
           copyEsrTextToClipboard(this);
        })
    }
})();
