import React, { useEffect, useState, createRef } from 'react'
import newsApi from '../../services/common/news'
import { Card, Popup, Segment, Image, Icon, Ref } from 'semantic-ui-react'
import { StyledNewsTitle, StyledCardContent, StyledArrow } from './index.style'
import { RouteTypes } from '../../Constants'
import notify from '../../services/common/notify'

const ArticlesList = (props) => {

  const [newsData, setNewsData] = useState({
    isBusy: false,
    articles: props.articles || []
  })

  let createdRef = null

  const { isBusy, articles } = newsData

  useEffect(() => {
    if (!props.articles) {
      fetchNews()
    }
  }, [])

  const fetchNews = async () => {
    setNewsData(prevData => ({ ...prevData, isBusy: true }))
    try {
      const newsResponse = await newsApi.getTopNews('gb')
      setNewsData(prevData => ({
        ...prevData,
        articles: newsResponse.data.articles,
        isBusy: false
      }))
    } catch (error) {
      notify(error.response.data.message, 'error')
      setNewsData(prevData => ({ ...prevData, isBusy: false }))
    }
  }

  const composeUrl = (urlData, index) => {
    const { articleGroup, articleId } = urlData
    return RouteTypes.ARTICLE.replace(':articleGroup', articleGroup).replace(':articleId', articleId).replace(':index', index)
  }

  const getArrows = () => {
    return <>
      <StyledArrow size="big" name="arrow alternate circle left outline"></StyledArrow>
      <StyledArrow right="true" size="big" name="arrow alternate circle right outline"></StyledArrow>
    </>
  }

  const renderArticles = () => {

    return <Ref>
      <Card.Group style={props.styleCardsGroup}>
        {props.styleCardsGroup && getArrows()}
        {articles.map((article, index) => {
          const urlData = props.urlData || { articleGroup: 'country', articleId: 'gb', index: index }
          const location = composeUrl(urlData, index)
          return <Card key={index}>
            <Card.Content>
              <div>
                <p style={{ marginBottom: 0, color: 'black' }}>{'Title'}</p>
                <div style={{ marginBottom: '5px' }}>
                  <Popup
                    trigger={<StyledNewsTitle>{article.title}</StyledNewsTitle>}
                    content={article.title} />
                </div>
              </div>
              {article.urlToImage && <Image
                size='small'
                src={article.urlToImage}
              />
              }
            </Card.Content>
            <Card.Content extra>
              <StyledCardContent onClick={() => props.history.push(location)} style={{ float: 'right', cursor: 'pointer' }}>
                {'More'}
                <Icon name='angle right' />
              </StyledCardContent>
            </Card.Content >
          </Card>
        })}
      </Card.Group>
    </Ref>
  }

  return <Segment style={props.style} loading={isBusy}>
    {renderArticles()}
  </Segment>
}
export default ArticlesList