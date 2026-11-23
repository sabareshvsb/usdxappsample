const NAME_POOL = [
  'Aarav Mehta',
  'Abhishek Roy',
  'Aditya Rao',
  'Aisha Khan',
  'Akash Verma',
  'Ananya Iyer',
  'Anjali Bose',
  'Arjun Nair',
  'Asha Patil',
  'Ashish Dubey',
  'Avni Shah',
  'Bharat Joshi',
  'Bhavesh Patel',
  'Charu Malhotra',
  'Chetan Shetty',
  'Deepa Nair',
  'Devendra Singh',
  'Dhruv Kapoor',
  'Divya Menon',
  'Gaurav Sethi',
  'Harshita Jain',
  'Hitesh Bansal',
  'Isha Kapoor',
  'Jatin Kulkarni',
  'Kavya Reddy',
  'Kunal Soni',
  'Lakshmi Rao',
  'Manish Tiwari',
  'Meera Nambiar',
  'Mohit Agarwal',
  'Neha Bansal',
  'Nikhil Desai',
  'Nisha Parikh',
  'Pankaj Yadav',
  'Payal Sharma',
  'Pranav Kulkarni',
  'Priya Sharma',
  'Rahul Chauhan',
  'Rajat Sinha',
  'Rakshit Shetty',
  'Rashi Gupta',
  'Ravi Prakash',
  'Reema Thakur',
  'Rhea Kapoor',
  'Rohit Bhalla',
  'Sagar Shetty',
  'Samarth Joshi',
  'Sana Qureshi',
  'Shreya Bose',
  'Siddharth Jain',
  'Sonam Chauhan',
  'Suresh Babu',
  'Tanvi Deshpande',
  'Tarun Malhotra',
  'Varsha Nair',
  'Vikas Chaudhary',
  'Vinay Rao',
  'Yash Agarwal',
  'Yogita Rane',
  'Zoya Ahmed',
]

function shuffle(items) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = current
  }

  return result
}

export function createLeaderChoices() {
  const names = shuffle(NAME_POOL)

  return {
    topLeaders: names.slice(0, 10),
    directLeaders: names.slice(10, 50),
  }
}
