const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var generateHTML = require("./generateHTML");
const path = require("path");
var convertapi = require('convertapi')('jEiQE3KMpaUiVZt7');
const questions = ["What is your Github user name?","Choose your favorite color"];


function promptUser(){
 return inquirer
 .prompt([{
     type: "input",
     name: "username",
     message: questions[0]
 },{
     type: "list",
     name: "colorchoice",
     choices: ["green","blue","pink","red"],
     message: questions[1]
 }])

}

function init() {
    return promptUser().then(function({username, colorchoice }){
        const queryUrl = `https://api.github.com/users/${username}`;
        axios
        .get(queryUrl)
        .then(function(response){
const res = response.data;
response.data.color = colorchoice;
const name = res.name;
const userBio = res.bio;
const publicRepos = res.public_repos;
const followers = res.followers;
const starred = res.starred_url.split(",")
res.stars = starred.length;
const following = res.following;

console.log(res)
console.log(name, `\n`, userBio, `\n`,publicRepos, `\n`, followers, `\n`, following)

const html= generateHTML(res);
writeToFile("profile.html", html);

})
convertapi.convert('pdf', {File: './profile.html'})
.then(function(result){
    return result.file.save(__dirname + "/profile.pdf");
})
.then(function(file){
    console.log("file saved:"+ file);
});
 })
}
function writeToFile(fileName, data) {
    return fs.writeFileSync(path.join(process.cwd(),fileName),data);
   }

init();
