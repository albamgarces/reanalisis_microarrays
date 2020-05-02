// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "D-Sas4_1", "brains and imaginal discs from D-Sas4 mutant 3rd instar Drosophila larvae, biological replicate 1", "genotype: DSas-4 mutant", "Gene expression data from mitotic Drosophila cells that do not have centrioles", "DSas-4 mutant" ], [ "2", "D-Sas4_2", "brains and imaginal discs from D-Sas4 mutant 3rd instar Drosophila larvae, biological replicate 2", "genotype: DSas-4 mutant", "Gene expression data from mitotic Drosophila cells that do not have centrioles", "DSas-4 mutant" ], [ "3", "D-Sas4_3", "brains and imaginal discs from D-Sas4 mutant 3rd instar Drosophila larvae, biological replicate 3", "genotype: DSas-4 mutant", "Gene expression data from mitotic Drosophila cells that do not have centrioles", "DSas-4 mutant" ], [ "4", "D-Ssas6_1", "brains and imaginal discs from D-Ssas6 mutant 3rd instar Drosophila larvae, biological replicate 1", "genotype: DSas-6 mutant", "Gene expression data from mitotic Drosophila cells that do not have centrioles", "DSas-6 mutant" ], [ "5", "D-Ssas6_2", "brains and imaginal discs from D-Ssas6 mutant 3rd instar Drosophila larvae, biological replicate 2", "genotype: DSas-6 mutant", "Gene expression data from mitotic Drosophila cells that do not have centrioles", "DSas-6 mutant" ], [ "6", "D-Ssas6_3", "brains and imaginal discs from D-Ssas6 mutant 3rd instar Drosophila larvae, biological replicate 3", "genotype: DSas-6 mutant", "Gene expression data from mitotic Drosophila cells that do not have centrioles", "DSas-6 mutant" ], [ "7", "SakOE_1", "brains and imaginal discs from Sak overexpressing 3rd instar Drosophila larvae, biological replicate 1", "genotype: Sak overexpression", "Gene expression data from mitotic Drosophila cells that have too many centrosomes", "Sak overexpression" ], [ "8", "SakOE_2", "brains and imaginal discs from Sak overexpressing 3rd instar Drosophila larvae, biological replicate 2", "genotype: Sak overexpression", "Gene expression data from mitotic Drosophila cells that have too many centrosomes", "Sak overexpression" ], [ "9", "SakOE_3", "brains and imaginal discs from Sak overexpressing 3rd instar Drosophila larvae, biological replicate 3", "genotype: Sak overexpression", "Gene expression data from mitotic Drosophila cells that have too many centrosomes", "Sak overexpression" ], [ "10", "w67WT_1", "brains and imaginal discs from w67 wild type 3rd instar Drosophila larvae, biological replicate 1", "genotype: white wild type", "Gene expression data from mitotic Drosophila wild type cells", "white wild type" ], [ "11", "w67WT_2", "brains and imaginal discs from w67 wild type 3rd instar Drosophila larvae, biological replicate 2", "genotype: white wild type", "Gene expression data from mitotic Drosophila wild type cells", "white wild type" ], [ "12", "w67WT_3", "brains and imaginal discs from w67 wild type 3rd instar Drosophila larvae, biological replicate 3", "genotype: white wild type", "Gene expression data from mitotic Drosophila wild type cells", "white wild type" ], [ "13", "OregonRWT_1", "brains and imaginal discs from OregonR wild type 3rd instar Drosophila larvae, biological replicate 1", "genotype: OregonR wild type", "Gene expression data from mitotic Drosophila wild type cells", "OregonR wild type" ], [ "14", "OregonRWT_2", "brains and imaginal discs from OregonR wild type 3rd instar Drosophila larvae, biological replicate 2", "genotype: OregonR wild type", "Gene expression data from mitotic Drosophila wild type cells", "OregonR wild type" ], [ "15", "OregonRWT_3", "brains and imaginal discs from OregonR wild type 3rd instar Drosophila larvae, biological replicate 3", "genotype: OregonR wild type", "Gene expression data from mitotic Drosophila wild type cells", "OregonR wild type" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
