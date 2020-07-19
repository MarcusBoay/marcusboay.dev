import styled from 'styled-components'

export const StyledHomePageLayout = styled.div`
    background: #1f1f23;
    color: white;
    font-family: 'Courier New', Courier, monospace;
`

export const StyledHomeFirstSection = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    margin: auto;
`

export const StyledHomeFirstSectionTextContainer = styled.div`
    margin: auto;
    text-align: center;
`

export const StyledHomeTitle = styled.h1``

const sectionMargin = 24

export const StyledHomeSection = styled.div`
    min-height: 60vh;
    margin: ${`${sectionMargin}px`};
    display: flex;
    flex-direction: row;
`

export const StyledHomeSectionInner = styled.div<{ right?: boolean }>`
    width: ${props => (props.right ? `calc(65% - 24px)` : `calc(35% - 24px)`)};
    margin-right: ${props => (props.right ? `0px` : `${sectionMargin}px`)};
    display: flex;
    flex-direction: column;

    img {
        object-fit: cover;
        max-height: 800px;
        width: 100%;
        padding: 0px;
    }
`

export const StyledHomeSectionTitle = styled.h2`
    margin-top: 0px;
`

export const StyledHomeSectionText = styled.p`
    margin-bottom: 1em;
`

export const StyledHomeSectionLinksContainer = styled.ul`
    align-self: flex-end;
    padding-left: 0;
    margin-top: auto;
`

export const StyledHomeSectionLinkContainer = styled.li`
    display: inline;
    margin-left: 2em;
`

export const StyledHomeSectionLink = styled.a`
    font-size: 20px;
    color: white;
    text-decoration: none;

    :hover {
        font-style: italic;
        color: white;
        cursor: pointer;
    }
`
