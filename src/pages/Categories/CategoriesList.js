import React, { useEffect, useState, useContext } from 'react'
import { categories } from '../../Constants'
import { CategoryWrapper, CategoryContent } from './style'
import { getAllCategories } from '../../services/common/categories'
import notify from '../../services/common/notify'
import { LanguageContext } from '../../LanguageContext'
import Accordion from '../../components/Accordion/Accordion'
import HeaderComp from '../../components/Header/HeaderComp'
import CarouselComp from '../../components/Carousel/CarouselComp'
import LoaderComp from '../../components/Loader/LoaderComp'

export const pageSize = 5

const CategoriesList = () => {

  const { language } = useContext(LanguageContext)

  const [articlesData, setArticlesData] = useState({
    isBusy: false,
    articles: {}
  })

  const [activeIndex, setActiveIndex] = useState(-1)

  const { articles, isBusy } = articlesData

  useEffect(() => {
    fetchArticlesInCategorie()
  }, [])

  const fetchArticlesInCategorie = async () => {
    setArticlesData(prevData => ({ ...prevData, isBusy: true }))
    try {
      const articles = {}
      const response = await getAllCategories(language.id, pageSize)

      categories.forEach((categorie, index) => {
        articles[categorie.id] = response[index].data.articles
      })

      setArticlesData({
        ...articlesData,
        articles,
        isBusy: false
      })
    } catch (error) {
      if (error.response) {
        notify(error.response.data.message, 'error')
      }
      else {
        notify('General error.', 'error')
      }
      setArticlesData(prevData => ({ ...prevData, isBusy: false }))
    }
  }

  const handleClick = (index) => {
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  const renderCategories = () => {
    return (
      <div>
        {categories.map((category, index) => {
          const urlData = {
            articleGroup: 'category',
            articleId: category.id
          }
          return (
            <Accordion
              active={activeIndex === index}
              index={index}
              handleClick={handleClick}
              categoryTitle={category.title}
              key={index}
            >
              <CarouselComp
                slides={articles[category.id]}
                {...urlData}
              />
            </Accordion>
          )
        })}
      </div>
    )
  }

  return (
    <CategoryWrapper>
      <CategoryContent>
        <HeaderComp title={`Top 5 news by categories from the ${language.country}:`} />
        <LoaderComp isBusy={isBusy} />
        {Object.keys(articles).length > 0 && renderCategories()}
      </CategoryContent>
    </CategoryWrapper>
  )

}
export default CategoriesList
