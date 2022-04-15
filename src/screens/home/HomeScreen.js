// Copyright 2019 The FairDataSociety Authors
// This file is part of the FairDataSociety library.
//
// The FairDataSociety library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The FairDataSociety library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the FairDataSociety library. If not, see <http://www.gnu.org/licenses/>.

import React, { memo } from 'react'
import styled, { css } from 'styled-components/macro'
import { Upload } from './components/upload/Upload'

const Layout = styled.section`
  display: flex;
  width: 100%;
  height: 100%;
`

const Content = styled.div`
  width: 418px;
  padding: 40px;
  box-sizing: border-box;
`

const Carousel = styled.div`
  flex: 1;
`

export const HomeScreen = memo(({ ...props }) => {
  return (
    <Layout>
      <Content>
        <Upload />
      </Content>
      <Carousel></Carousel>
    </Layout>
  )
})

HomeScreen.displayName = 'HomeScreen'
