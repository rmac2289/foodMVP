

const apiKey = 'e665e607a65e442b806a7f9495411f15'
const baseURL = 'https://api.spoonacular.com/'

/* PARAMATER FORMATTING FUNCTION */ 

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  /* TRIVIA DISPLAY */ 

function displayTrivia(responseJson1){
    console.log(responseJson1);
    $('.didYouKnow').append(`<p>${responseJson1.text}</p>`)
}
/* MEAL PLAN DISPLAY */ 

function displayMealPlan(responseJson2) {
    console.log(responseJson2.week);
    let data = responseJson2.week;
    let days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

    $('.mealWeek').empty();
    for (i=0; i < days.length ;i++){
        $('.mealWeek').append(`
        <ul class="mealList">
            <h3 class="days">${days[i]}</h3>
            <li><h4><span class="meal">breakfast:</span><a class="mealLink" href="${data[days[i]].meals[0].link}" target="_blank"> ${data[days[i]].meals[0].cleanTitle}</a></h4></li>
            <li><h4><span class="meal">lunch:</span><a class="mealLink" href="${data[days[i]].meals[1].link}" target="_blank"> ${data[days[i]].meals[1].cleanTitle}</a></h4></li>
            <li><h4><span class="meal">dinner:</span><a class="mealLink" href="${data[days[i]].meals[2].link}" target="_blank"> ${data[days[i]].meals[2].cleanTitle}</a></h4></li>
        </ul>
            `);
        }}

/* MEAL & TRIVIA FETCH */ 


function getAPIS(diet,calories,exclude,ingredient){
    function paramEditor(){
    if (diet=='' && calories=='' && exclude==''){
        return params = {
        apiKey: apiKey
        }
    } else if (diet=='' && calories=='' && exclude!==''){
        return params = {
        exclude: exclude,
        apiKey: apiKey
        }
    } else if (diet=='' && exclude=='' && calories!==''){
        return params = {
        calories: calories,
        apiKey: apiKey
        }
    } else if (exclude=='' && calories=='' && diet!==''){
        return params = {
        diet: diet,
        apiKey: apiKey
        }
    }else if (diet=='' && exclude !== '' && calories !== ''){
        return params = {
        calories: calories,
        exclude: exclude,
        apiKey: apiKey
        }
    } else if (exclude!=='' && diet !=='' && calories == ''){
        return params = {
        diet: diet,
        exclude: exclude,
        apiKey: apiKey
        }
    } else if (calories !=='' && diet!=='' && exclude==''){
        return params = {
        diet: diet,
        calories: calories,
        apiKey:apiKey
        }
    } else {
        return params = {
        diet: diet,
        calories: calories,
        exclude: exclude,
        apiKey: apiKey
        }
    }
}
    const params2 = {
        ingredientName: ingredient,
        apiKey: apiKey
    }
    let paramEdit = paramEditor()
    let newParams = formatQueryParams(paramEdit);
    let ingredientParams = formatQueryParams(params2)

    const ingredientURL = `${baseURL}food/ingredients/substitutes?${ingredientParams}`
    const mealURL = `${baseURL}mealplanner/generate?${newParams}`
    
        let firstAPICall = fetch(ingredientURL);
        let secondAPICall = fetch(mealURL);

      
        Promise.all([firstAPICall, secondAPICall])
          .then(values => Promise.all(values.map(value => value.json())))
          .then(finalVals => {
            let responseJson1 = finalVals[0];
            let responseJson2 = finalVals[1];
            console.log(responseJson1); 
            displayMealPlan(responseJson2);
          });
      
        }

/* ON SUBMITTING FORM FUNCTION */

function ingredientForm(){
    $('.ingredientForm').submit(event => {
        event.preventDefault();
        const ingredient = $('#ingredient').val();
        getAPIS(ingredient);
    })
}

function watchForm() {
    focus();
    ingredientForm();
    $('.mainForm').submit(event => {
        event.preventDefault();
        const diet = $('#diet').val();
        const calories = $('#calories').val();
        const exclude = $('#exclude').val();
       getAPIS(diet,calories,exclude);
       

    })
}
/* LINE ON SEARCH FORM */

function focus(){
    $("#diet").focus();
  };


$(watchForm);
$(ingredientForm);