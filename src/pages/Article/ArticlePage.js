import React, { useState, useEffect, useContext } from "react"
import { useParams } from 'react-router-dom'
import { LanguageContext } from "../../LanguageContext"
import type { LanguageType } from '../../types/languageType'

/* Components */
import HeaderComp from '../../components/Header/HeaderComp'
import Chevron from '../../components/Chevron'
import LoaderComp from "../../components/Loader/LoaderComp"
import Layout from '../Layout'

/* Styles */
import { StyledWrapper, StyledImage, StyledBackTo, StyledContent } from './style'

/* Services */
import articleApi from '../../services/common/news'
import notify from '../../services/common/notify'

/* Constants */
import { LabelsToTranslate, ArticleGroups } from '../../Constants'

type ArticlePageProps = {
  language: LanguageType,
  setDisableButtons: boolean,
  history: Object
}

const ArticlePage = (props: ArticlePageProps) => {

  const { language, setDisableButtons } = useContext(LanguageContext)

  const [data, setData] = useState({
    isBusy: false,
    article: {}
  })

  const { isBusy, article } = data
  const { articleGroup, articleId, index } = useParams();

  useEffect(() => {
    setDisableButtons(true)
    getArticle()
    return () => setDisableButtons(false)
  }, [])

  const getArticle = async () => {
    setData(prevData => ({ ...prevData, isBusy: true }))
    try {
      let responseArticles = {}
      if (articleGroup === ArticleGroups.country) {
        responseArticles = await articleApi.getTopNews(language.id)
      }
      else {
        responseArticles = await articleApi.getArticle(language.id, articleGroup, articleId)
      }
      setData({
        ...data,
        isBusy: false,
        article: responseArticles.data.articles[index]
      })
    } catch (error) {
      if (error.response) {
        notify(error.response.data.message, 'error')
      }
      else {
        notify('General error.', 'error')
      }
      setData(prevData => ({ ...prevData, isBusy: false }))
    }
  }

  const handleBack = () => {
    props.history.goBack()
  }

  return (
    <Layout>
      <LoaderComp isBusy={isBusy} />
      <StyledWrapper>
        {article && <>
          <HeaderComp style={{ marginLeft: 0 }} title={article.title || ''} />
          {article.urlToImage && <StyledImage src={article.urlToImage || ''} />}
          <StyledContent>{article.content || ''}</StyledContent>
          <StyledBackTo onClick={handleBack}>
            <Chevron position={'left'} fill={'#4183c4'} width={14}></Chevron>
            <p>{LabelsToTranslate.BACK_TO_LIST}</p>
          </StyledBackTo >
        </>
        }
      </StyledWrapper>
    </Layout>

  )
}
export default ArticlePage
