import React, { useContext, useEffect, useState } from 'react'
import { LanguageContext } from '../../LanguageContext'
import type { LanguageType } from '../../types/languageType'

/* Components */
import Card from '../../components/ArticleCard.js/Card'
import HeaderComp from '../../components/Header/HeaderComp'
import LoaderComp from '../../components/Loader/LoaderComp'
import Layout from '../Layout'

/* Styles */
import { StyledArticleGroup } from './style'

/* Services */
import newsApi from '../../services/common/news'
import notify from '../../services/common/notify'

/* Constants */
import { RouteTypes, LabelsToTranslate, ArticleGroups } from '../../Constants'

type ArticlesListProps = {
  language: LanguageType,
  articles?: Array<Object>,
  urlData?: Object,
  removeMainMenuAndHeader?: boolean,
  style?: Object
}

const ArticlesList = (props: ArticlesListProps) => {

  const { language } = useContext(LanguageContext)

  const [newsData, setNewsData] = useState({
    isBusy: false,
    articles: props.articles || []
  })

  const { isBusy, articles } = newsData

  useEffect(() => {
    if (!props.articles) {
      fetchNews()
    }
  }, [props])

  const fetchNews = async () => {
    setNewsData(prevData => ({ ...prevData, isBusy: true }))
    try {
      const newsResponse = await newsApi.getTopNews(language.id)
      setNewsData(prevData => ({
        ...prevData,
        articles: newsResponse.data.articles,
        isBusy: false
      }))
    } catch (error) {
      if (error.response) {
        notify(error.response.data.message, 'error')
      }
      else {
        notify('General error.', 'error')
      }
      setNewsData(prevData => ({ ...prevData, isBusy: false }))
    }
  }

  const composeUrl = (urlData, index) => {
    const { articleGroup, articleId } = urlData
    return RouteTypes.ARTICLE.replace(':articleGroup', articleGroup).replace(':articleId', articleId).replace(':index', index)
  }

  const renderArticles = () => {
    return (
      <StyledArticleGroup style={props.style}>
        {articles.map((article, index) => {
          const urlData = props.urlData || { articleGroup: ArticleGroups.country, articleId: 'gb', index: index }
          const url = composeUrl(urlData, index)
          return (
            <Card
              key={index}
              articlePage={url}
              {...article} />
          )
        })}
      </StyledArticleGroup>
    )
  }

  return (
    <Layout removeMainMenuAndHeader={props.removeMainMenuAndHeader}>
      <LoaderComp isBusy={isBusy} />
      {!props.removeMainMenuAndHeader && <HeaderComp
        style={{ display: 'flex', justifyContent: 'center' }}
        title={`${LabelsToTranslate.TOP_NEWS_HEADER} ${language.country}:`}
      />}
      {articles.length > 0 && renderArticles()}
    </Layout>
  )
}
export default ArticlesList
