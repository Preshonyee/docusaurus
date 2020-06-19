// The difference between the heading token and paragraph is 3,
// heading_open, inline, heading_close
const fs = require("fs")

const markdownIt = require("markdown-it")()

const template = fs.readFileSync('template.md', 'utf-8');
const tempTokens = markdownIt.parse(template)
const REGEX = /^(h3)((p)+(code)+)+$/g

function getRepresentation(tokens) {
  const formattedTokens = tokens.filter(function filterTokens(token){
    return !token.type.includes('close') && !token.type.includes('inline')
  }).map(function tranformTokens(token){
    return token.tag
  })

  return formattedTokens.join('')
}

module.exports = {
  names: [ "enforce-api-structure" ],
  description: "Enforces the structure of an API file",
  tags: [ "API", "md", "structure" ],
  function: function rule(params, onError) {
    const myTokens = params.tokens.filter(function filterTokens(token){
      return !token.type.includes('close') && !token.type.includes('inline')
    }).map(function tranformTokens(token){
      return token.tag
    })
    const tempRepresentation = getRepresentation(tempTokens)
    const indexes = params.tokens.map(function mapToIndex(token, index) {
      const isNewSection = token.type === 'heading_open';
      if (isNewSection) return index
      return undefined
    }).filter(function filterIndexes(index) {
      return index !== undefined
    })

    for(let i = 0; i < indexes.length; i++){
      // slice works with undefined, in case of the index be greater than indexes length
      const content = params.tokens.slice(indexes[i], indexes[i+1])
      const contentRepresentation = getRepresentation(content)
      const [isValidAPI] = contentRepresentation.match(REGEX) || ['']
      if(isValidAPI !== contentRepresentation) {
        // see how I'll get these number things
        onError({
          "lineNumber": 1,
          "detail": "Your file is not following the recommended structure"+ contentRepresentation,
          "context": "aaaa"
        });
      }
    }
  }
}
