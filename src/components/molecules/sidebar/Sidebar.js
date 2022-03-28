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
import { Text } from '../../../components'
import { SidebarLink } from '../sidebarLink/SidebarLink'

const Container = styled.div`
  background-color: ${({ theme }) => theme?.colors?.ntrl_lighter?.main};
  width: 100%;
  max-width: 322px;
  height: 100%;
`

const Content = styled.nav`
  padding: 24px 40px;
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
`

export const Sidebar = memo(({ headline, ...props }) => {
  return (
    <Container>
      <Content>
        <Text size="xl" weight="light">
          {headline}
        </Text>

        <List>
          <SidebarLink>Sent</SidebarLink>

          <SidebarLink count={2}>Received</SidebarLink>

          <SidebarLink>My honest inbox</SidebarLink>
        </List>
      </Content>
    </Container>
  )
})

Sidebar.displayName = 'Sidebar'
