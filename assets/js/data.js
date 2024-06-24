import { calculateTimeframes, generateID } from "./utilities.js";

export const datas = [
  {
    _id: generateID(),
    title: "Work",
    tasks: [
    
    ],
    
  },
  {
    _id : generateID(),

    title: "Play",
    tasks: [
     
    ],
    
  },
  {
    _id : generateID(),

    title: "Study",
    tasks: [
      
    ],
   
  },
  {
    _id : generateID(),

    title: "Exercise",
    tasks: [
      
    ],
   
  },
  {
    _id : generateID(),
    title: "Social",
    tasks: [
      
    ],
  },
  {
    _id : generateID(),
    title: "Self Care",
    tasks: [
      
    ],
    
  },
];





datas.forEach(data => {
  data.timeframes = calculateTimeframes(data.tasks);
});