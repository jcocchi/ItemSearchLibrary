module.exports = (params) => {
  if (params.length > 1) {
    return fakeDataSet2
  }

  return fakeDataSet1
}

const fakeDataSet1 = [
  {
    title: 'McDonald\'s Ice Cream',
    subtitle: 'Very creamy',
    text: 'Affordable and delicious',
    imageUrl: 'https://jeffeats.com/wp-content/uploads/2015/07/image49.jpg',
    openUrl: 'https://www.mcdonalds.com/us/en-us/product/vanilla-reduced-fat-ice-cream-cone.html'
  },
  {
    title: 'Cold Stone',
    subtitle: 'So fun to customize!',
    text: 'Lots of choices',
    imageUrl: 'https://www.coldstonecreamery.com/assets/img/products/sundaes/sundaes.jpg',
    openUrl: 'https://www.coldstonecreamery.com/'
  }
]

const fakeDataSet2 = [
  {
    title: 'McDonald\'s Ice Cream',
    subtitle: 'Very creamy',
    text: 'Affordable and delicious',
    imageUrl: 'https://jeffeats.com/wp-content/uploads/2015/07/image49.jpg',
    openUrl: 'https://www.mcdonalds.com/us/en-us/product/vanilla-reduced-fat-ice-cream-cone.html'
  },
  {
    title: 'Cold Stone',
    subtitle: 'So fun to customize!',
    text: 'Lots of choices',
    imageUrl: 'https://www.coldstonecreamery.com/assets/img/products/sundaes/sundaes.jpg',
    openUrl: 'https://www.coldstonecreamery.com/'
  },
  {
    title: 'Ben & Jerry\'s',
    subtitle: 'Top of the line ice cream',
    text: 'Great company, great ice cream',
    imageUrl: 'http://retailers.s3.amazonaws.com/retailers/files/Ben-Jerrys.png',
    openUrl: 'http://www.benjerry.com/flavors?utm_medium=cpc&utm_source=google&utm_campaign=g_benjerrys_brand&utm_term=%2Bben%20%2Band%20%2Bjerry%27s&utm_content=generalbrandterms&gclid=CjwKEAjwgZrJBRDS38GH1Kv_vGYSJAD8j4Dfja1OTuE65LhUWWq7S0wQqV43049KZpwQ2r6QtOg9ghoCHnfw_wcB'
  }
]
