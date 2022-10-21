// firebase key
const firebaseConfig = {
  apiKey: "AIzaSyDpdthQ2QgSAERzYrrqFfDIQ0t8Uz32WNY",
  authDomain: "bmi-cal-84850.firebaseapp.com",
  projectId: "bmi-cal-84850",
  storageBucket: "bmi-cal-84850.appspot.com",
  messagingSenderId: "60476407136",
  appId: "1:60476407136:web:e7ef77aa87021b0b64f205",
};

firebase.initializeApp(firebaseConfig);

// DOM 定義
const height = document.getElementById('height');
const weight = document.getElementById('weight');
const btn = document.getElementById('btn');
const list = document.getElementById('list');

// 拿取資料，渲染畫面
const ref = firebase.database().ref();
ref.on('value', function(snapshat) { 
  let str = '';
  let data = [];
  snapshat.forEach(function(item) {
    data.push({
      key: item.key,
      content: item.val()
    });
  });
  data.reverse();
  for (let item in data){
    str += `<div  data-key=${data[item].key} class="gap-3 w-5/6 md:w-3/4 flex flex-wrap justify-between bg-white
              mx-auto mb-4 px-4 items-center py-3 border-l-4 border-${data[item].content.color}">
              <div class="title text-xl w-24">${data[item].content.state}</div>
              <div class="bmi flex items-center">
                <p class="mr-2">BMI</p>
                <span class="text-xl">${data[item].content.bmi}</span>
              </div>
              <div class="weight flex items-center">
                <p class="mr-2">體重</p>
                <span class="text-xl">${data[item].content.weight}</span>
                <span class="text-xl">kg</span>          
              </div>
              <div class="height flex items-center">
                <p class="mr-2">身高</p>
                <span class="text-xl">${data[item].content.height}</span>
                <span class="text-xl">cm</span>
              </div>
              <div class="date">
                <span>${data[item].content.date}</span>
              </div>
              <i class="fa-solid fa-trash ml-2 cursor-pointer"></i>
            </div>`;
  }
  list.innerHTML = str;
});

// 新增資料
btn.addEventListener('click', function() {
  let data={
    height: Math.floor(height.value),
    weight: Math.floor(weight.value),
    bmi: (weight.value / (height.value/100 * height.value/100)).toFixed(2),
    date: format(new Date()),
    state: printBmi(height.value, weight.value).status,
    color: printBmi(height.value, weight.value).color,
  }
  ref.push(data);
  height.value = '';
  weight.value = '';
});

// 刪除資料
list.addEventListener('click', function(e) {
  if (e.target.nodeName === 'I') {
    let key = e.target.parentNode.dataset.key;
    ref.child(key).remove();
  }
});


// 格式化日期
function format(inputDate) {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

    date = date
        .toString()
        .padStart(2, '0');

    month = month
        .toString()
        .padStart(2, '0');

  return `${month}-${date}-${year}`;
}

const bmiStatesData = {
  "overThin": {
    "state": "過輕",
    "color": "blue-500"
  },
  "normal": {
    "state": "理想",
    "color": "green-500"
  },
  "overWeight": {
    "state": "過重",
    "color": "orange-300"
  },
  "mildFat": {
    "state": "輕度肥胖",
    "color": "orange-500"
  },
  "moderateFat": {
    "state": "中度肥胖",
    "color": "orange-700"
  },
  "severeFat": {
    "state": "重度肥胖",
    "color": "red-500"
  },
}

// bmi 計算
function printBmi(height, weight){
  let bmi = weight / (height/100 * height/100);
  let bmiStatus = '';
  switch(true){
    case bmi < 18.5:
      bmiStatus = 'overThin';
      break;
    case bmi >= 18.5 && bmi < 24:
      bmiStatus = 'normal';
      break;
    case bmi >= 24 && bmi < 27:
      bmiStatus = 'overWeight';
      break;
    case bmi >= 27 && bmi < 30:
      bmiStatus = 'mildFat';
      break;
    case bmi >= 30 && bmi < 35:
      bmiStatus = 'moderateFat';
      break;
    case bmi >= 35:
      bmiStatus = 'severeFat';
      break;
    default:
      alert('您的數值輸入錯誤，請重新輸入');
      return;
  }
  let bmiData = {
    status: bmiStatesData[bmiStatus].state,
    color: bmiStatesData[bmiStatus].color,
  }
  return bmiData;
}
