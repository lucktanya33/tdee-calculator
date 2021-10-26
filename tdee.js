const mainArea = document.querySelector('.main')
const levelArea = document.querySelector('.level')
const form = document.querySelector('form')
let tdee = ''
let bmr = ''
let dailyColories = ''
// 事件-點擊說明活動量程度
levelArea.addEventListener('click', function (e) {
  let target = e.target
  if (target.classList.contains('level-info')) {
    document.querySelector('#level_info_area').classList.remove('hidden')
    e.preventDefault()
  }
})
//--函式--計算TDEE
function calculateTDEE(gender, kg, cm, age, level, cb) {
  // 固定資料(tdee計算公式 https://www.verywellfit.com/what-is-bmr-or-basal-metabolic-rate-3495380)
  const formulaFemale = {base: 447.593, coefficientWeight: 9.247, coefficientHeight: 3.098, coefficientAge: 4.3}
  const formulaMale = {base: 88.362, coefficientWeight: 13.397 , coefficientHeight: 4.799, coefficientAge: 4.330}      
  if (gender == 'male') {
    let bmr = formulaMale.base 
        + (kg * formulaMale.coefficientWeight)
        + (cm * formulaMale.coefficientHeight)
        - (age * formulaMale.coefficientAge)
    let tdee = Math.round(bmr * level) //經四捨五入
    cb(bmr, tdee)
  } else {
    let bmr = formulaFemale.base 
        + (kg * formulaFemale.coefficientWeight)
        + (cm * formulaFemale.coefficientHeight)
        - (age * formulaFemale.coefficientAge)
    let tdee = Math.round(bmr * level) 
    cb(bmr, tdee)
  }
}

//--函式--計算增肌減脂
function getDailyCalories(cutOrGain, tdee, kg, month, cb) {
  let dailyColories
  let change = (kg * 7700) / (month * 30)
  if (cutOrGain === '減脂') {
    let dailyColories = Math.round(tdee - change)
    console.log('減脂熱量', dailyColories);
    cb(dailyColories)
  } else {
    let dailyColories = Math.round(tdee + change)
    console.log('增肌熱量', dailyColories);
    cb(dailyColories)
  }
} 
//--函式--欄位數值判斷
function ifOverLimit(weight, height, age, level) {
  if (weight > 200 | weight < 1) {
    return true
  }
  if (height > 250 | height < 1) {
    return true
  }
  if (age > 150 | age < 1) {
    return true
  }
  if (level > 1.9 | level < 1) {
    return true
  }
}    

// 事件-提交表單
form.addEventListener('submit', function(e) {
  // 清除重複點擊計算按鈕
  const result = document.querySelector('.result')
  const tdee_result = document.querySelector('.tdee_result')
  if (result.querySelector('.tdee_result')) {
    console.log('hi');
    result.removeChild(tdee_result)
  }
  // 拿 client端 input
  let inputWeight = document.querySelector('input[name=weight]').value
  const inputHeight = document.querySelector('input[name=height]').value
  const inputAge = document.querySelector('input[name=age]').value
  const inputLevel = document.querySelector('input[name=level]').value
  // 未選性別判斷
  const maleChecked = (document.querySelector('#gender_male').checked)
  const femaleChecked = (document.querySelector('#gender_female').checked)
  let notChecked = (maleChecked == false && femaleChecked == false)
  // 檢查--有空白未填
  let ifNull = (inputWeight == '' | inputHeight == '' | inputAge == '' | inputLevel == '' | notChecked)
  if (ifNull) {
    alert ('填寫未完全')
    return
  }
  // 檢查--輸入非數字
  if (isNaN(inputWeight) | isNaN(inputHeight) | isNaN(inputAge) | isNaN(inputLevel) ){
    alert('請輸入數字')
    return
  }

  // 檢查--數值範圍
  if (ifOverLimit(inputWeight, inputHeight, inputAge, inputLevel)) {
    alert('請符合各項輸入範圍')
    return
  }

  // 計算TDEE
  const gender = document.querySelector('[name=gender]:checked').value
  calculateTDEE(gender, inputWeight, inputHeight, inputAge, inputLevel, (bmr, tdee) => {
    console.log('I AM IN CALLBACK', 'BMR', bmr)
    console.log('I AM IN CALLBACK', 'TDEE', tdee)

    // 新增tdee結果
    const resultArea = document.querySelector('.result')
    const tdeeResult = document.createElement('div')
    resultArea.appendChild(tdeeResult)
    tdeeResult.outerHTML = `
    <div class ='tdee_result'>
    <div>
    <h1>計算結果</h1>
    <div>你的 tdee 是 ${tdee} 大卡</div>
    <p>每天不吃超過 ${tdee} 大卡，體重將維持不變</p>
    <button class ="del-form btn_small">了解如何增肌減脂</button>
    </div>
    `
    // 向下滾動到結果
    window.scrollBy({
      left: 10,
      top: 300,
      behavior: 'smooth'
    })
    e.preventDefault()
    
    // 事件-點擊按鈕:了解增肌減脂
    mainArea.addEventListener('click', (e) =>{
      target = e.target
      if (target.classList.contains('del-form')) {
       mainArea.removeChild(document.querySelector('.form'))
       document.querySelector('.tdee_result > div').removeChild(document.querySelector('.del-form'))
       const newForm = document.createElement('div')
       mainArea.appendChild(newForm)
       newForm.outerHTML = `
       <form class="form2"> 
        <h1>增肌減脂計算機</h1>
        <div class="fit debug">
          <div>你想要增肌或減脂？</div>
          <div>
            <div>
              <label for="fit_cut" class="lebel_font">減脂</label>
              <input type="radio" id="fit_cut" value="減脂" name="fit">
            </div>
            <div>
              <label for="fit_gain" class="lebel_font">增肌</label>
              <input type="radio" id="fit_gain" value="增肌" name="fit">
            </div>
          </div>
        </div>
        <div class="period debug">
          <div>你想花多久達成目標？</div>
          <div>
            <div>
              <label for="period_long" class="lebel_font">六個月</label>
              <input type="radio" id="period_long" value="6" name="period">
            </div>
            <div>
              <label for="period_short" class="lebel_font">三個月</label>
              <input type="radio" id="period_short" value="3" name="period">
            </div>
          </div>
        </div>
        <div class="goal debug">
          <div>你想要增/減幾公斤？</div>
          <input name="goal">
        </div>
        <div class="submit debug">
          <input type ="submit" value="計算每天熱量攝取" class="btn_big">
        </div>
        <div class="reset">
          <input type="button" value="重新計算 TDEE" class="btn_big" onClick="window.location.reload();">
        </div>
      </form>`
      const form2 = document.querySelector('.form2')
      // 事件-提交form2 計算增肌減脂
      form2.addEventListener('submit', (e) => {
        // 清除重複點擊計算按鈕
        const result2 = document.querySelector('.result2')
        const tdee_result2 = document.querySelector('.tdee_result2')
        if (result2.querySelector('.tdee_result2')) {
          console.log('hi');
          result2.removeChild(tdee_result2)
        }
        e.preventDefault()
        const fit = document.querySelector('[name=fit]:checked').value
        const period = document.querySelector('[name=period]:checked').value
        const goal = document.querySelector('[name=goal]').value

        // 檢查目標
        if (goal === '') {
          alert('請輸入未輸入資料')
          return
        }

        // 計算增肌減脂
        getDailyCalories(fit, tdee, goal, period, (dailyColories) => {
          console.log('callback', dailyColories);//callback 回傳的增肌或減脂熱量
          // 新增增肌減脂結果
          const resultArea2 = document.querySelector('.result2')
          const tdeeResult2 = document.createElement('div')
          resultArea2.appendChild(tdeeResult2)
          tdeeResult2.outerHTML = `
          <div class ='tdee_result2'>
          <div>
          <p>你想要在 ${period} 個月內${fit} ${goal} 公斤</p>
          <div>每天應該吃 ${dailyColories} 大卡</div>
          </div>
          `
          // 向上滾動到結果
          window.scrollBy({
            left: 10,
            top: -250,
            behavior: 'smooth'
          })
        })
        e.preventDefault()
      })
      }
    })
  })
})