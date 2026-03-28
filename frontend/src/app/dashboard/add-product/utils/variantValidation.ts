export function validateVariant(
 attributes:any[],
 variant:any,
 pricing:any[]
) {

 const issues:any[] = []

 if(pricing.length === 0){
  issues.push({
   section:"pricing",
   message:"Marketplace pricing required"
  })
 }

 attributes.forEach(a=>{
  if(a.isRequired && !variant.attributes?.[a._id]){
   issues.push({
    section:"attributes",
    message:`${a.attributeName} required`
   })
  }
 })

 return issues
}