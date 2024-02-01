const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
// console.log(uppercaseCheck);
// console.log(lowercaseCheck)
// console.log(numbersCheck);
// console.log(symbolsCheck);


//symbol string
let symboles="@#$%^&*()_+{}-=':";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength circle color to grey
setIndicator('#ccc');

//1.copy() 2.handleslider() 3.generate password() 4.setIndicator() 5.getRandomInteger(min,max) 6.getRandomUppercase() 
//7.getRandomLowercase() 8.getRandomSymbol() 9.calcStrength()

//set password length nd reflect in UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) *100/(max - min)) + "% 100%";

}

//color set 
function setIndicator(color){
    indicator.style.backgroundColor = color ;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperrcase(){
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbols(){
    const randomNum = getRandomInteger(0,symboles.length);
    return symboles.charAt(randomNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper=true;
    if (lowercaseCheck.checked)hasLower= true;
    if(numbersCheck.checked ) hasNum = true;
    if(symbolsCheck.checked ) hasSymbol = true;

    if(hasLower && hasUpper && (hasNum || hasSymbol) && passwordLength>8){
        setIndicator('#0f0');
    }
    else if((hasLower || hasUpper) && (hasNum|| hasSymbol) && passwordLength >5){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00');
    }
}


async function copyContent(){
    try{
     await navigator.clipboard.writeText(passwordDisplay.value);
     copyMsg.innerHTML="copied";
    }
    catch(e){
        copyMsg.innerHTML="failed";
    }
//copy vala span visible
    copyMsg.classList.add("active");
    setTimeout( ()=> {
        copyMsg.classList.remove("active")
    },2000);
}

function handleCheckboxChange(){
    checkCount =0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount+=1;
    });

    //special condition (if all checkbox are checked but length <4 or like wise)
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
    //fisher yates method -- array pr apply kri tene shuffle kri shakay
   
    for(let i= array.length-1;i>0;i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp = array[i]
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el)=>(str += el));
    return str;
}

allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

generatebtn.addEventListener("click",()=>{
    //none of chechbox selected
    if(checkCount == 0) 
    return;
    
    //special case
    if(passwordLength<=checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //find new password

    //remove old password
    password="";

    //stuff mensioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperrcase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerrcase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbols();
    // }
    let funcArr =[];
    // console.log(uppercaseCheck);
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperrcase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    //compolsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    // console.log("compolsory addition");
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex= getRandomInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }
    // console.log("remaining addition");


    //shuffle password
    password= shufflePassword(Array.from(password));
    // console.log("shuffle password")  
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();

})