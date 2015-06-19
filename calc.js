/**
 * Created by Pharmedio on 6/19/2015.
 */
(function calculator(c, $) {
    "use strict";

    //---------- Private Variables
    var A = 0;
    var B = 0;
    var operation = "";
    var screenString = "";
    var databaseString = ""; // Allows you to see all operations among database

    //---------- Add Function
    function add(a, b) {
        return a + b;
    }
    //---------- Multiply Function
    function multiply(a, b) {
        return a * b;
    }
    //---------- Divide Function
    function divide(a, b) {
        return a / b;
    }
    //---------- Subtract Function
    function subtract(a, b) {
        return a - b;
    }
    //---------- Squared Function
    function squared(a) {
        return a * a;
    }
    //---------- Get Variable A Function
    c.getA = function () {
        return A;
    }
    //---------- Get Variable B Function
    c.getB = function () {
        return B;
    }
    //---------- Set Variable A Function
    c.setA = function (screenA) {
        A = screenA;
        console.log("getA: " + A);
    }
    //---------- Set Variable B Function
    c.setB = function (screenB) {
        B = screenB;
        console.log("getB: " + B);
    }
    //---------- Get Operation Function
    c.getOperation = function () {
        return operation;
    }
    //---------- Set Operation Function
    c.setOperation = function (o) {
        operation = o;
        console.log("getOperation: " + operation);
    }
    //---------- Get Screen String Function
    c.getScreenString = function () {
        return screenString;
    }
    //---------- Set Screen String Function
    c.setScreenString = function (string) {
        screenString = string;
        console.log("getScreen: " + screenString);
    }
    //---------- Get Database String Function
    c.getDatabaseString = function () {
        return databaseString;
    }
    //---------- Set Database String Function
    c.setDatabaseString = function (string) {
        databaseString = string;
        console.log("getString: " + databaseString);
    }
    //---------- Clear All Variables Function
    c.clearAll = function () {
        A = 0;
        B = 0;
        operation = "";
        screenString = "";
        databaseString = "";
    }
    //---------- Clear Screen Function
    c.clearScreen = function () {
        screenString = "";
    }
    //---------- Clear Data String Function
    c.clearDataString = function () {
        databaseString = "";
    }
    //---------- Equals Function
    c.equals = function () {
        if (operation === "/") {
            A = divide(A, B);
        } else if (operation === "*") {
            A = multiply(A, B);
        } else if (operation === "--") {
            A = subtract(A, B);
        } else if (operation === "X^2") {
            A = squared(A);
        } else if (operation === "+") {
            A = add(A, B);
        }
        console.log(A);
        return A;
    }
}(window.calculator = window.c || {}, window.jQuery));

//---------- screen is equal to calculator(HTML Code where numbers appear)
var $screen = $('#calculator');

//---------- post my equations to database
//AJAX
var postEquation = function (equationString) {
    $.ajax({
        method: "POST",
        url: "http://192.168.1.198:8080/ajax/notes/insertCalcHistory", // Where Data is Going
        data: {                 // The data that the database is going to read in
            user: "Alkia",
            body: equationString
        },
        success: function (response) { //function that occurs when data pushes to database
            alert("Success!");
            calculator.clearDataString();
        },
        error: function (response) {    //function that occurs when data doesnt push to database
            alert("Something bad happened!");
        }
    });
};

//---------- get equations that was posted on database
//AJAX
var getEquations = function () {
    var alertString = ""; //declaration to print alert
    $.ajax({
        method: "GET",             //Similar to post. Where to Receive data from database
        url: "http://192.168.1.198:8080/ajax/notes/getCalcHistory",
        data: {                     //Recieve all data from username(can be anyone)
            user: "Alkia"
        },
        dataType: "json",         //datatype for information being recieved
        success: function (response) {    //Function occurs id data is received correctly
            for (var i = 0; i < response.data.length; i++) {
                alertString += (response.data[i].body + "\n");
            }
            alert(alertString);
        },
        error: function (response) { //Function occurs if error occurs while trying to receive data
            alert("Something bad happened!");
        }
    });
};

//---------- Check for decimals
var checkDecimal = function () {
    if (calculator.getScreenString().includes(".") === true) {
        $('#decimal').addClass('disabled');
    }

    if (calculator.getScreenString().includes(".") === false) {
        $('#decimal').removeClass('disabled');
    }
};

//----------> Function that takes the value of a number and adds it to the current screenString
$('.number').on('click', function () {
    calculator.setScreenString($screen.val());
    calculator.setScreenString(calculator.getScreenString() + $(this).text());
    $screen.val(calculator.getScreenString());
    checkDecimal();
});

//----------> Clear Function
$('#clear').on('click', function () {
    calculator.clearScreen();
    $screen.val(calculator.getScreenString());
});


//---------->  Operator Function
$('.operation').on('click', function () {
    //Gets the current screen string to be used in all parts of the function
    calculator.setScreenString($screen.val());
    //Checks to see if the Clear button is pushed
    if ($(this).text() === "clear") {
        //If nothing is on screen and the Clear button is pushed it will reset everything to 0
        if (calculator.getScreenString() === "") {
            calculator.clearAll();
        } //Otherwise it will delete the last number added to the screen
        else {
            calculator.setScreenString(calculator.getScreenString().slice(0, calculator.getScreenString().length - 1));
            $screen.val(calculator.getScreenString());
        }
    } //Handles all other operation buttons
    else {
        //If nothing is on screen pushing an operater other than Clear will not do anything
        if (calculator.getScreenString() !== "") {
            //If operation is blank the number on the screen is set to A and the operation is set
            if (calculator.getOperation() === "") {
                calculator.setA(parseFloat(calculator.getScreenString()));
                calculator.setDatabaseString(calculator.getDatabaseString() + $screen.val() + $(this).text());
                calculator.setOperation($(this).text());
            } //If operation has a value that operation is executed then the new operation is added
            else {
                calculator.setB(parseFloat(calculator.getScreenString()));
                calculator.setDatabaseString(calculator.getDatabaseString() + $screen.val() + $(this).text());
                calculator.equals();
                calculator.setOperation($(this).text());
            }
        }
        //----------> Resets the screen for next operation
        calculator.clearScreen();
        $screen.val(calculator.getScreenString());
    }
    checkDecimal();
});

//----------> Squared Function
$('#squared').on('click', function () {
    calculator.setScreenString($screen.val());
    calculator.setDatabaseString(calculator.getDatabaseString() + $screen.val());
    calculator.setB(parseFloat(calculator.getScreenString()));
    console.log("a: " + calculator.getA());
    console.log(calculator.getOperation());
    $screen.val(calculator.equals().toFixed(5));
    calculator.setOperation("");
    calculator.setScreenString($screen.val());
    checkDecimal();
});

//----------> Equals Button
$('#equals').on('click', function () {
    if ($screen.val() !== "") {
        calculator.setScreenString($screen.val());
        calculator.setDatabaseString(calculator.getDatabaseString() + $screen.val());
        postEquation(calculator.getDatabaseString());
        calculator.setB(parseFloat(calculator.getScreenString()));
        console.log("a: " + calculator.getA());
        console.log(calculator.getOperation());
        console.log("b: " + calculator.getB());
        $screen.val(calculator.equals().toFixed(1));
        calculator.setOperation("");
        calculator.setScreenString($screen.val());
        checkDecimal();
    } else {
        getEquations();
    }
});