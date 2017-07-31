console.log('OkCupid Import');
var IMPORTANCE = [0, 1, 10, 50, 250]

var fs = require('fs');
//var arrayOfObjects = null;

// Synchronous read of JSON file
var data = fs.readFileSync('profiles.json');
var arrayOfObjects = JSON.parse(data);

var my_profile = arrayOfObjects.profiles[9];
//console.log(my_profile);
var other_profile = arrayOfObjects.profiles[0];
//console.log(my_profile);


//matching(my_profile, other_profile);
ranking(arrayOfObjects);

function ranking(all_profiles) {
    var f = 0;
    var h = 1;
    var matches = [];

    while (all_profiles.profiles[f]) {
        while (all_profiles.profiles[h]) {
            /*if(all_profiles.profiles[f]===all_profiles.profiles[h]){
                h++;
            }*/
            //Get the 'matching' using the function declared above
            match_score_1 = matching(all_profiles.profiles[f], all_profiles.profiles[h]);
            //console.log("Match 1:  "+match_score_1);
            match_score_2 = matching(all_profiles.profiles[h], all_profiles.profiles[f]);
            //console.log("Match 2: "+match_score_2);
            full_match = Math.sqrt(match_score_1 * match_score_2);
            matches.push({
                profile: all_profiles.profiles[h].id,
                result: (full_match.toPrecision(5)) + "%"
            });

            //console.log("Profile: " +all_profiles.profiles[f].id+ " Your match against profile: " +all_profiles.profiles[h].id +" was " + full_match);
            //console.log(" "); 
            h++; //move to the next other profile   
        }
        console.log("Profile: " + all_profiles.profiles[f].id + " top ten matches are: ");
        //sort and give first 10 profiles using slice
        console.log(matches.sort(function(a, b) {
            var valueA, valueB;
            valueA = a.result;
            valueB = b.result;
            if (valueA > valueB) {
                return -1;
            } else if (valueA < valueB) {
                return 1;
            }
            return 0;
        }).slice(0, 10));

        f++; //move to the next profile
        h = 0;
        //reset for the next profile
        matches = [];

    }

}


function matching(a_profiles, b_profile) {

    var input = a_profiles;
    var other_input = b_profile;

    var earned_points = 0
    var possible_points = 0

    var i = 0;
    var j = 0;
    while (input.answers[i]) {
        while (other_input.answers[j]) {
            if (input.answers[i].questionId === other_input.answers[j].questionId) {
                //Check if we both answered this question.
                importance = IMPORTANCE[input.answers[i].importance];
                possible_points += importance
                /*
            console.log("Both answered question " + other_input.answers[j].questionId);
            console.log("Answer i  " + input.answers[i].answer);
            console.log("Importance of this quesiton "+input.answers[i].importance);
            console.log("Acceptable answers from the other person " + input.answers[i].acceptableAnswers);
            console.log("Other person Answered j  " + other_input.answers[j].answer);
            console.log("Acceptable j " + other_input.answers[j].acceptableAnswers);
            console.log("Possible points: "+possible_points);
        */
                var k = 0;
                while (input.answers[i].acceptableAnswers[k]) {
                    if (other_input.answers[j].answer === input.answers[i].acceptableAnswers[k]) {
                        earned_points += importance;
                        //once answer is found break since no others will match
                        break;

                    } else {
                        k++
                    }
                }
                break;
            } else {
                j++;
            }
        }
        i++;
        j = 0;

    } //Return the final 'matching' 
    matching_total = (earned_points) / (possible_points);
    //console.log(matching_total); 
    return matching_total;
}