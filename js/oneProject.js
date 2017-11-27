var ReportData = new Array();
var ReportIndex = 0;
var FieldData = new Array();
var FidIndex = 0;
var EditReportFID = 0;
var EditReportID = 0;
var MargeArrays = new Array();
var FieldNumberArray = new Array();
var blueCounter = 0;
var lastFID = 0;

$(function () {
    $('#reportList tr').click(function () {
        var id = $(this).attr('id').substr(1);
        //alert(id);
    });
    $('#btnAddField').click(function (e) {
        e.preventDefault();
        $('#viewAddField').show();
        $('#btnAddField').hide();
        $('#btnSave').hide();
    });
    $('#addField').click(function (e) {
        e.preventDefault();
        addField();
    });

    $('#btnCancel').click(function (e) {
        e.preventDefault();
        $('#editContainer').hide();
        $('#viewContainer').show();
    });
    $('#btnCancel').click(function (e) {
        e.preventDefault();
        getReportList();
    });
    $('#btnCancelAddField').click(function (e) {
        e.preventDefault();
        $('#updateAddFieldBtn').removeClass('disabled');
        $('#viewAddField').hide();
        //$('#viewFieldContainer').show();
        $('#btnAddField').show();
        //$('#saveBtn').show();
        ErrorStatus();
        clearFFields();
    });
});
/*
 * @author Iffat Nizu
 * @description Get information of all reports.
 * @param {None}  
 * @returns {None}
 */
function getReportList() {
    $.post('http://localhost/DynamicReportTool/Apps/oneProject.php',
            {cmd: 'get'},
            function (data) {
                if (data.Status !== 'Ok') {
                    return alert(data.Status, false);
                }
                ReportData = data.ListData;
                var table = '';
                $.each(ReportData, function (key, value) {
                    table += '<tr id="R' + key + '"><td>' + value.Title + ' </td>' +
                            '<th>' +
                            '<a class="btn btn-info editBtn" onclick = "return editReport(' + value.ReportID + ')" id ="editBtn' + value.ReportID + '">' +
                            '<span class="glyphicon glyphicon-pencil"></span>&nbsp;Edit</a></th></tr>';
                });
                $('#reportList').html(table);
                $('#reportList').show();
            }, 'json'
            );
}
/*
 * @author Iffat Nizu
 * @description This function edit report data including showing field data table with edit/delete/add option
 * @borrows ErrorStatus as ErrorStatus (Error Message status) and getReportField as getReportField(Get report field data)
 * @param {int} ReportID
 * @returns {None}
 */
function editReport(ReportID) {
    EditReportID = ReportID;
    $('#viewAddField').hide();
    $('#viewContainer').hide();
    $('#editContainer').show();
    $('#btnAddField').show();


    $.each(ReportData, function (key, value) {
        if (value.ReportID == ReportID) {
            ReportIndex = key;
        }
    });

    $('#Title').val(ReportData[ReportIndex].Title);
    $('#ReportTitle').val(ReportData[ReportIndex].ReportTitle);
    $('#ReportSubtitle').val(ReportData[ReportIndex].ReportSubtitle);
    $('#Section').val(ReportData[ReportIndex].Section);
    $('#Description').val(ReportData[ReportIndex].Description);
    $('#ReportSQL').val(ReportData[ReportIndex].ReportSQL);
    $('#DateCreated').val(ReportData[ReportIndex].DateCreated);
    $('#CreatedBy').val(ReportData[ReportIndex].CreatedBy);

    $('#Title').blur(function () {
        ReportData[ReportIndex]['Title'] = $('#Title').val();
    });
    $('#ReportTitle').blur(function () {
        ReportData[ReportIndex]['ReportTitle'] = $('#ReportTitle').val();
        ErrorStatus();
    });
    $('#ReportSubtitle').blur(function () {
        ReportData[ReportIndex]['ReportSubtitle'] = $('#ReportSubtitle').val();
        ErrorStatus();
    });
    $('#Section').blur(function () {
        ReportData[ReportIndex]['Section'] = $('#Section').val();
    });
    $('#Description').blur(function () {
        ReportData[ReportIndex]['Description'] = $('#Description').val();
    });
    $('#ReportSQL').blur(function () {
        ReportData[ReportIndex]['ReportSQL'] = $('#ReportSQL').val();
        ErrorStatus();
    });
//    var ReportDataInfo = {};
//
//    ReportDataInfo.ReportID = ReportID;
//    ReportDataInfo.Title = $('#Title').val();
//    ReportDataInfo.ReportTitle = $('#ReportTitle').val();
//    ReportDataInfo.ReportSubtitle = $('#ReportSubtitle').val();
//    ReportDataInfo.Section = $('#Section').val();
//    ReportDataInfo.Description = $('#Description').val();
//    ReportDataInfo.ReportSQL = $('#ReportSQL').val();

    getReportField(ReportID);
}
/*
 * @author Iffat Nizu
 * @description Cancel button action for edit report details
 * @borrows doGet as doGet function to get all reports info
 * @returns {None} 
 */
function cancelReport() {
    clearFields();
    clearFFields();
    clearEditFields(EditReportFID);
    getReportList();
}
function getReportField(ReportID) {
    $.post('http://localhost/DynamicReportTool/Apps/oneProject.php',
            {
                cmd: 'getReportField',
                ReportID: ReportID
            },
            function (data) {
                if (data.Status !== 'Ok') {
                    return alert(data.Status, false);
                }
                FieldData = data.Result;
                $('#loadingDiv').show();
                displayFieldList(FieldData);
                $('#loadingDiv').hide();
            }, 'json'
            );
}

/*
 * @author Iffat Nizu
 * @description Edit Field list (Inline)
 * @param {Int} ReportFID, key
 * @returns {None}
 */
function editField(ReportFID, key) {
    FidIndex = key;
    EditReportFID = ReportFID;
    $('#btnCancelField' + ReportFID).show();
    $('#btnUpdateField' + ReportFID).show();
    $('#btnEditField' + ReportFID).hide();
    $('#btnDeleteField' + ReportFID).hide();
    $('.btnDeleteF').addClass('disabled');
    $('.btnEditF').addClass('disabled');


    $('#FieldNo' + ReportFID).append(function () {
        var content = $(this).text();
        $(this).html('<input class="EditFields" type="text" id="editFieldNo' + ReportFID + '" name ="editFieldNo' + ReportFID + '" value="' + content + '"><span class="Restore' + ReportFID + '" id="FieldNo' + ReportFID + '">' + content + '</span>');
    });
    $('#FieldTitle' + ReportFID).append(function () {
        var content = $(this).text();
        $(this).html('<input class="EditFields" type="text" id="editFieldTitle' + ReportFID + '" name ="editFieldTitle' + ReportFID + '" value=" ' + content + '"><span class="Restore' + ReportFID + '" id="FieldTitle' + ReportFID + '">' + content + '</span>');
    });
    $('#FieldType' + ReportFID).append(function () {
        var content = $(this).text();
        $(this).html('<input class="EditFields" type="text" id="editFieldType' + ReportFID + '" name ="editFieldType' + ReportFID + '" value="' + content + '"><span class="Restore' + ReportFID + '" id="FieldType' + ReportFID + '">' + content + '</span>');
    });
    $('#DefaultValue' + ReportFID).append(function () {
        var content = $(this).text();
        $(this).html('<input class="EditFields" type="text" id="editDefaultValue' + ReportFID + '" name ="editDefaultValue' + ReportFID + '" value="' + content + '"><span class="Restore' + ReportFID + '" id="DefaultValue' + ReportFID + '">' + content + '</span>');
    });
    $('#ValueMin' + ReportFID).append(function () {
        var content = $(this).text();
        $(this).html('<input class="EditFields" type="text" id="editValueMin' + ReportFID + '" name ="editValueMin' + ReportFID + '" value="' + content + '"><span class="Restore' + ReportFID + '" id="ValueMin' + ReportFID + '">' + content + '</span>');
    });
    $('#ValueMax' + ReportFID).append(function () {
        var content = $(this).text();
        $(this).html('<input class="EditFields" type="text" id="editValueMax' + ReportFID + '" name ="editValueMax' + ReportFID + '" value="' + content + '"><span class="Restore' + ReportFID + '" id="ValueMax' + ReportFID + '">' + content + '</span>');
    });
    $('.Restore' + ReportFID).hide();

    var FieldNoBkUp = $('#FieldNo' + ReportFID).text();
    $('#editFieldNo' + ReportFID).blur(function () {

        if (blueCounter === 0) {
            FieldNumberArray = jQuery.grep(FieldNumberArray, function (value) {
                return value != FieldNoBkUp;
            });
        } else if (blueCounter > 0) {
            var editFieldNoBkUp = FieldData[FidIndex]['FieldNo'];
            FieldNumberArray = jQuery.grep(FieldNumberArray, function (value) {
                return value != editFieldNoBkUp;
            });
        }
        blueCounter++;
        FieldNumberArray.push($('#editFieldNo' + ReportFID).val());
        FieldData[FidIndex]['FieldNo'] = $('#editFieldNo' + ReportFID).val();
        ErrorStatus();
    });
    $('#editFieldTitle' + ReportFID).blur(function () {
        FieldData[FidIndex]['FieldTitle'] = $('#editFieldTitle' + ReportFID).val();
    });
    $('#editFieldType' + ReportFID).blur(function () {
        FieldData[FidIndex]['FieldType'] = $('#editFieldType' + ReportFID).val();
    });
    $('#editDefaultValue' + ReportFID).blur(function () {
        FieldData[FidIndex]['DefaultValue'] = $('#editDefaultValue' + ReportFID).val();
    });
    $('#editValueMin' + ReportFID).blur(function () {
        FieldData[FidIndex]['ValueMin'] = $('#editValueMin' + ReportFID).val();
    });
    $('#editValueMax' + ReportFID).blur(function () {
        FieldData[FidIndex]['ValueMax'] = $('#editValueMax' + ReportFID).val();
    });
    ErrorStatus();
}
/*
 * @author Iffat Nizu
 * @description Update report field details (Inline) in datatable
 * @param {int} reportFID (ReportFID Field ID)
 * @returns {None}
 */
function updateField(ReportFID) {
    if ($('#editFieldNo' + ReportFID).val() === "") {
        //return doAlert("You must provide a field number.");
        return $.alert({
            title: 'Alert!',
            content: 'You must provide a field number!',
        });
    }
    if ($('#editFieldTitle' + ReportFID).val() === "") {
        return $.alert({
            title: 'Alert!',
            content: 'You must provide a field title!',
        });
    }
    if ($('#editFieldType' + ReportFID).val() === "") {
        return $.alert({
            title: 'Alert!',
            content: 'You must provide a field type!',
        });
    }
    if ($('#editValueMin' + ReportFID).val() !== '' && $('#editValueMin' + ReportFID).val() > $('#editValueMax' + ReportFID).val()) {
        return $.alert({
            title: 'Alert!',
            content: 'Maximum value must be equal or greater than Minimum value!',
        });
    }
    $('#btnEditField' + ReportFID).show();
    $('#btnDeleteField' + ReportFID).show();
    $('#btnCancelField' + ReportFID).hide();
    $('#btnUpdateField' + ReportFID).hide();
    $('.EditFields').hide();
    $('.Restore' + ReportFID).show();
    blueCounter = 0;
    displayFieldList(FieldData);
}
function displayFieldList(FieldData) {
    FieldNumberArray = [];
    var table = '';
    $.each(FieldData, function (key, value) {
        // push field data to field number array for the report
        FieldNumberArray.push(FieldData[key].FieldNo);
        table += '<tr class="DataTable" id="RF ' + key + '"> <td id= "messageAlert' + FieldData[key].ReportFID + '">' + '</td><td id="FieldNo' + value.ReportFID + '">' + value.FieldNo + '</td><td id="FieldTitle' + value.ReportFID + '">' + value.FieldTitle + '</td><td id="FieldType' + value.ReportFID + '">'
                + value.FieldType + '</td><td id="DefaultValue' + value.ReportFID + '">' + value.DefaultValue + '</td><td id="ValueMin' + value.ReportFID + '">' + value.ValueMin + '</td><td id="ValueMax' + value.ReportFID + '">' + value.ValueMax + '</td>' +
                '<th>' +
                '<span class="btnEditF"><a class="btn btn-info" id="btnEditField' + value.ReportFID + '" onclick = "return editField(' + value.ReportFID + ',' + key + ')">Edit&nbsp;&nbsp; </a></span>' +
                '<span class="btnDeleteF"><a class="btn btn-danger" id="btnDeleteField' + value.ReportFID + '" onclick = "return delFieldBtnAction(' + value.ReportFID + ')">&nbsp;Delete </a></span>' +
                '<span class="btnCancelF"><a class="btn btn-danger" style="display:none" id="btnCancelField' + value.ReportFID + '" onclick = "return cancelField(' + value.ReportFID + ')">Cancel&nbsp;&nbsp; </a></span>' +
                '<span class="btnUpdateF"><a class="btn btn-info" style="display:none" id="btnUpdateField' + value.ReportFID + '" onclick = "return updateField(' + value.ReportFID + ',' + key + ')">&nbsp;Update </a></span></th></tr>';
        lastFID = parseInt(value.ReportFID);
    });
    $('#viewFieldBody').html(table);
    $('#btnSave').show();
    ErrorStatus();
}
/*
 * @author Iffat Nizu
 * @description add inline fields of Field list
 * @param {None}
 * @returns {None}
 */
function addField() {
    var FieldDataInfo = {};
    FieldDataInfo['ReportFID'] = lastFID + 1;
    FieldDataInfo['ReportID'] = EditReportID;
    if ($('#FieldNo').val() === "") {
        //return doAlert("You must provide a field number.");
        return $.alert({
            title: 'Alert!',
            content: 'You must provide a field number!'
        });
        exit(0);
    }
    FieldDataInfo['FieldNo'] = $('#FieldNo').val();
    if ($('#FieldTitle').val() === "") {
        return $.alert({
            title: 'Alert!',
            content: 'You must provide a field title!'
        });
    }
    FieldDataInfo['FieldTitle'] = $('#FieldTitle').val();
    if ($('#FieldType').val() === "") {
        return $.alert({
            title: 'Alert!',
            content: 'You must provide a field type!'
        });
    }
    FieldDataInfo['FieldType'] = $('#FieldType').val();
    FieldDataInfo['DefaultValue'] = $('#DefaultValue').val();
    FieldDataInfo['ValueMin'] = $('#ValueMin').val();
    FieldDataInfo['ValueMax'] = $('#ValueMax').val();

    if ($('#ValueMin').val() !== '' && $('#ValueMin').val() > $('#ValueMax').val()) {
        return $.alert({
            title: 'Alert!',
            content: 'Maximum value must be equal or greater than Minimum value!'
        });
    }
    $('#viewAddField').hide();
    $('#btnAddField').show();
    FieldData[FieldData.length] = FieldDataInfo;
    //$('#addFieldContainer').hide();
    //$('#addFieldBtn').show();
    FieldNumberArray = [];
    blueCounter = 0;
    //$('#fieldAddingMessage').text('');
    clearFFields();
    displayFieldList(FieldData);
}
// Delete Button alert Action
function delFieldBtnAction(ReportFID) {
    //return alert(' Are you sure you would like to delete?', true, 'deleteField(' + ReportFID + ');');
    $.confirm({
        title: 'Confirm!',
        content: 'Are you want to Delete?',
        buttons: {
            confirm: function () {
                deleteField(ReportFID);
            },
            cancel: function () {

            }
        }
    });
}
/*
 * @author Iffat Nizu
 * @description Delete report field row
 * @param {int} reportFID (Report Field ID)
 * @returns {None} 
 */
function deleteField(ReportFID) {
    FieldNumberArray = [];
    FieldData = FieldData.filter(function (el) {
        return el.ReportFID != ReportFID;
    });
    displayFieldList(FieldData);
}
function cancelField(ReportFID) {
    $('#btnEditField' + ReportFID).show();
    $('#btnDeleteField' + ReportFID).show();
    $('#btnCancelField' + ReportFID).hide();
    $('#btnUpdateField' + ReportFID).hide();
    $('.EditFields').hide();
    $('.Restore' + ReportFID).show();
    blueCounter = 0;
    clearEditFields(EditReportFID);
    ErrorStatus();
    //editReport(EditReportID)
    getReportField(EditReportID);
}

/*
 * @author Iffat Nizu
 * @description Format non parsed text from report input field
 * @param {non parsed text array from report input field} TextFrmForm
 * @returns {Array} textArray
 */
function formatTextArray(TextFrmForm) {
    var textArray = [];
    textArray = parseSQLVars(TextFrmForm);  // parse report sql and save it to array
    textArray = textArray.split(' ');
    return textArray;
}
function parseSQLVars(sql) {
    var result = '';
    var cpos = -1;
    for (var i = 0; i < sql.length; i++) {
        if (sql.substr(i, 1) === '$') {
            if (cpos === -1)
                cpos = i;
            else {
                fieldNo = sql.substr(cpos + 1, i - cpos - 1);
                cpos = -1;
                var j = 0;
                if (isNaN(fieldNo) ? !1 : (j = parseInt(fieldNo, 10), (0 | j) === j))
                    result += (result.length === 0 ? '' : ' ') + j;
                else
                    cpos = i;
            }
        }
    }
    return result;
}
/*
 * @author Iffat Nizu
 * @description Marge three arrays 
 * @param {Array} ArrayOne, ArrayTwo, ArrayThree
 * @returns {Array}  Final marged array
 */
function margeArray(ArrayOne, ArrayTwo, ArrayThree) {
    var tempArray = [];
    tempArray = ArrayOne.concat(ArrayTwo);
    var finalArray = [];
    finalArray = tempArray.concat(ArrayThree);
    return finalArray;
}

/* 
 * @author Iffat Nizu
 * @description Display alert message for report form variables. 
 * @borrows functions - formatTextArray(parsed text array) and checkTextVariable
 * @param: formInput - text value from report form
 *            alert_ID - ID of the input field from report form
 * Display Error Message OR clear Error message based on IF/ELSE statements
 * @returns None
 */
function alertMsgTextVr(formInput, alert_ID) {
    var textFieldArray = formatTextArray(formInput);
    var difftxtAr = checkTextVariable(textFieldArray, FieldNumberArray);
    if (difftxtAr.length !== 0) {
        $(alert_ID).text('');
        //Error = 1;
        $(alert_ID).append('Add field number $' + difftxtAr[0] + '$ missing variables using add field option');
        difftxtAr.length = 0;
    } else {
        $(alert_ID).text('');
    }
}
/*
 * @author Iffat Nizu
 * @description Check Report From Field Variables(ex - Report Title, Report Subtitle, Report SQL) are present or not in Field List
 * @Check one report form filed at a time
 * @param: TextArray - Parsed varaible list from report input form
 *            fieldNumberArray - Global Array of the report's fields
 * @returns Missing variables list in an Array
 */
function checkTextVariable(TextArray, fieldNumberArray) {
    var diffTextVariable = [];
    jQuery.grep(TextArray, function (el) {
        if (jQuery.inArray(el, fieldNumberArray) === -1)
            diffTextVariable.push(el);
    });
    return diffTextVariable;
}
/*
 * @author Iffat Nizu
 * @description ErrorStatus check error and display error for report field and list
 * @borrows functions : alertMsgTextVr(Display alert message for report filed variable) and margeArray(Mareged three arrays)
 * @param {None}
 * @returns {None}  
 */
function ErrorStatus() {
    var titleTextArray = [];
    var subTitleTextArray = [];
    var reportSqlTextArray = [];

    var alert_ID_1 = ("#ReportTitle_alert");
    var formInput_1 = $('#ReportTitle').val();
    alertMsgTextVr(formInput_1, alert_ID_1);
    titleTextArray = formatTextArray(formInput_1);

    var alert_ID_2 = ("#ReportSubtitle_alert");
    var formInput_2 = $('#ReportSubtitle').val();
    alertMsgTextVr(formInput_2, alert_ID_2);
    subTitleTextArray = formatTextArray(formInput_2);

    var alert_ID_3 = ("#suggestion_message");
    var formInput_3 = $('#ReportSQL').val();
    alertMsgTextVr(formInput_3, alert_ID_3);
    reportSqlTextArray = formatTextArray(formInput_3);
    //MargeArrays = margeArray(formatTextArray(ReportData[ReportIndex]['ReportTitle']), formatTextArray(ReportData[ReportIndex]['ReportSubtitle']), formatTextArray(ReportData[ReportIndex]['ReportSQL']));
    MargeArrays = margeArray(titleTextArray, subTitleTextArray, reportSqlTextArray);
    ErrorStatusField();

//    if (Error === 0) {
//        $('#saveBtn').show();
//    } else {
//        $('#saveBtn').hide();
//    }
}
function ErrorStatusField() {
    $.each(FieldData, function (key, value)
    {
        var FieldNo = value.FieldNo;
        var ReportFID = value.ReportFID;
        if ((jQuery.inArray(FieldNo, MargeArrays) !== -1))
        {
            $('#messageAlert' + ReportFID).find('span').remove();
            $('#messageAlert' + ReportFID).append('<span style = "color: green;" class="fa fa-1x fa-check-square"></span>');
        } else {
            $('#messageAlert' + ReportFID).find('span').remove();
            //Error = 1;
            $('#messageAlert' + ReportFID).append('<span style= "color: red;" class="fa fa-1x fa-exclamation-circle blink"></span>');
        }
    });
}
/*
 * @author Iffat Nizu
 * @description this function clear all values from report edit fields
 * @returns {None}
 */
function clearFields() {
    $('#Title').val('');
    $('#Section').val('');
    $('#Description').val('');
    $('#ReportSQL').val('');
    $('#DateCreated').val('');
    $('#CreatedBy').val('');
    $('#RulesRequired').val('');
}
/*
 * @author Iffat Nizu
 * @description this function clear edit field values
 * @returns {None}
 */
function clearEditFields(ReportFID) {
    $('#editFieldNo' + ReportFID).val('');
    $('#editFieldTitle' + ReportFID).val('');
    $('#editFieldType' + ReportFID).val('');
    $('#editDefaultValue' + ReportFID).val('');
    $('#editValueMin' + ReportFID).val('');
    $('#editValueMax' + ReportFID).val('');
}
/*
 * @author Iffat Nizu
 * @description this function clear all values from report add field form
 * @returns {None}
 */
function clearFFields() {
    $('#FieldNo').val('');
    $('#FieldTitle').val('');
    $('#FieldType').val('');
    $('#DefaultValue').val('');
    $('#ValueMin').val('');
    $('#ValueMax').val('');
}