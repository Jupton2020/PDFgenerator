const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
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
const resp = response.data;
response.data.color = colorchoice;
const name = resp.name;
const biography = resp.bio;
const pubRepos = resp.public_repos;
const follow = resp.followers;
const star = resp.starred_url.split(",")
resp.stars = star.length;
const following = resp.following;

console.log(name, `\n`, biography, `\n`,pubRepos, `\n`, follow, `\n`, following)
console.log(resp)

const html= generateHTML(resp);
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
