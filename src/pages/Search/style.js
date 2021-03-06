import styled from 'styled-components'

export const StyledInput = styled.input`
margin-top: 10px;
margin-bottom: 30px;
min-width: 40vw;
padding: .67857143em 1em;
-webkit-tap-highlight-color: rgba(255,255,255,0);
background: #fff;
border: 1px solid rgba(34,36,38,.15);
color: rgba(0,0,0,.87);
border-radius: .28571429rem;
`
export const StyledSegment = styled.div`
height: calc(100vh - 47px);
.wrapper{
  width: 100%;
  height: 15%;
  display: inline-block;
}
.noResultsMessage{
  text-align: center;
}
`
export const StyledArticleGroup = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
overflow-y: auto; 
max-height: 75vh; 
margin: 10px;
`
