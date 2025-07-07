// services/treeService.ts
import axios from 'axios'

const baseURL = import.meta.env.VITE_URL_API || 'https://flaskapi-ml.onrender.com'

export async function fetchStudentSleepsEnough() {
  const data = await axios.get(`${baseURL}/predict/student_sleeps_enough`)
  console.log('datos', data)
  return data
}

export async function fetchSocialMediaImpactAcademics() {
  const data = await axios.get(`${baseURL}/predict/social_media_impact_academics`)
  console.log('datos', data)
  return data
}
