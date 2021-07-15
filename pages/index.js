import React, { useState, useEffect } from 'react'

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.user}.png`}
        style={{ borderRadius: '8px' }}
      ></img>
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.user}`}>
          @{props.user}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="subTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.map((item, index) => {
          if (index >= 6) return
          return (
            <li key={item.id}>
              <a href={`/users/${item.login}`}>
                <img src={item.avatar_url} />
                <span>{item.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const [comunidades, setComunidades] = useState([])
  const githubUser = 'arthurmarconcini'
  const pessoasFavoritas = [
    'omariosouto',
    'juunegreiros',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'arthurmarconcini'
  ]

  //0 - pegar o array de dados do github
  const [seguidores, setSeguidores] = useState([])

  useEffect(() => {
    //buscar seguidores da api do GitHub
    fetch('https://api.github.com/users/rafaballerini/followers')
      .then(function (respostaDoServer) {
        return respostaDoServer.json()
      })
      .then(function (repostaCompleta) {
        setSeguidores(repostaCompleta)
      })
      .catch(e => {
        console.log(e)
      })

    //buscar comunidades do datoCMS com graphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        "Authorization": 'b51de1b66d79d08f07229f95c35f84',
        'Content-Type': 'application/json',
        "Accept": 'application/json'
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }`
      })
    }).then((response) => response.json())
    .then((respostaCompleta) => {
      setComunidades(respostaCompleta.data.allCommunities)
    })
  }, [])

  //1 - Criar um box que vai ter um map, baseado nos items do array que pegamos do Github

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar user={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCreateCommunity(e) {
                e.preventDefault()

                // Pegar os dados dos inputs pelo evento e Criar um objeto com eles
                const formData = new FormData(e.target)
                const comunidade = {                  
                  title: formData.get('title'),
                  imageUrl: formData.get('image'),
                  creatorSlug: githubUser,
                }

                if (!comunidade.title & !comunidade.image) {
                  return
                }

                console.log(comunidade)

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(comunidade)
                }).then(async (response) => {
                  const dados = await response.json();
                  const comunidade = dados.registroCriado;
                  const comunidadesAtt = [...comunidades, comunidade];
                  setComunidades(comunidadesAtt)
                })                
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  area-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  area-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox items={seguidores} title={'Seguidores'} />
          <ProfileRelationsBoxWrapper>
            <h2 className="subTitle">comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((item, index) => {
                if (index >= 6) return
                return (
                  <li key={item.id}>
                    <a href={`/communities/${item.id}`}>
                      <img src={item.imageUrl} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="subTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((pessoa, index) => {
                if (index >= 6) return
                return (
                  <li key={pessoa}>
                    <a href={`/users/${pessoa}`}>
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
