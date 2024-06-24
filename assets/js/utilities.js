
export const generateID = ()=>{
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(){
      return (Math.random()*16 | 0 ).toString(16)
    }).toLowerCase();
  }

  ;



  export const getTimeMunite = (AH,AM,BH,BM)=>{
    if (parseInt(AH) === 23 && BH == 0) {
      BH = 24
      
    }
    const startInMunite = AH *60 + Number(AM)
    const endInMunite = BH*60 + Number(BM)
    return endInMunite - startInMunite
  }




  export const convertMunitToNormalTime = (munit)=>{
    const h = Math.floor(munit/60)
    const min = munit % 60
    return h == 0 ? `${min} min `:` ${h}h ${min}min`

  }
  



  export const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };
  


  export const isYesterday = (someDate) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return someDate.getDate() === yesterday.getDate() &&
           someDate.getMonth() === yesterday.getMonth() &&
           someDate.getFullYear() === yesterday.getFullYear();
  };
  



  export const isThisWeek = (someDate, date) => {
    const today = date? date : new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - (today.getDay()=== 0 ? 6 : today.getDay()) ));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    return someDate >= startOfWeek && someDate <= endOfWeek;
  };
  


  export const startOfWeek = (d)=>{
    const date = new Date(d) 
     return new Date(date.setDate(date.getDate() - (date.getDay()=== 0 ? 6 : date.getDay()))).toDateString();
    
  }

  export const endOfWeek = (d)=>{
    const date = new Date(d) 
     return new Date(date.setDate(date.getDate() - (date.getDay()=== 0 ? 6 : date.getDay()) + 6)).toDateString();
    
  }

  


  export const isLastWeek = (someDate) => {
    const today = new Date();
    const startOfLastWeek = new Date(today.setDate(today.getDate() - (today.getDay()=== 0 ? 6 : today.getDay()) - 7));
    const endOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    return someDate >= startOfLastWeek && someDate <= endOfLastWeek;
  };


  
  export const isThisMonth = (someDate, date) => {
    const today = date? date : new Date();
    return someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };
  


  export  const isLastMonth = (someDate) => {
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
    return someDate.getMonth() === lastMonth.getMonth() &&
           someDate.getFullYear() === lastMonth.getFullYear();
  };

  
  export const calculateTimeframes = (tasks) => {
    const dailyCurrent = tasks.filter(task => isToday(new Date(task.createdAt)))
                              .reduce((sum, task) => sum + task.timeInMunite, 0);
  
    const dailyPrevious = tasks.filter(task => isYesterday(new Date(task.createdAt)))
                               .reduce((sum, task) => sum + task.timeInMunite, 0);
  
    const weeklyCurrent = tasks.filter(task => isThisWeek(new Date(task.createdAt)))
                               .reduce((sum, task) => sum + task.timeInMunite, 0);
  
    const weeklyPrevious = tasks.filter(task => isLastWeek(new Date(task.createdAt)))
                                .reduce((sum, task) => sum + task.timeInMunite, 0);
  
    const monthlyCurrent = tasks.filter(task => isThisMonth(new Date(task.createdAt)))
                                .reduce((sum, task) => sum + task.timeInMunite, 0);
  
    const monthlyPrevious = tasks.filter(task => isLastMonth(new Date(task.createdAt)))
                                 .reduce((sum, task) => sum + task.timeInMunite, 0);
  
    return {
      daily: {
        current: dailyCurrent,
        previous: dailyPrevious,
      },
      weekly: {
        current: weeklyCurrent,
        previous: weeklyPrevious,
      },
      monthly: {
        current: monthlyCurrent,
        previous: monthlyPrevious,
      },
    };
  };

  export const months = [
    "January", "February", "March" , " April", "May", "Jun", "July", "August", "September", "October","November", "December"
  ]
export const days = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
]