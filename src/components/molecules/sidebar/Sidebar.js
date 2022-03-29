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

import React, { memo, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components/macro'
import { DEVICE_SIZE } from '../../../theme/theme'
import { Text } from '../../atoms/text/Text'
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

const Breadcrumb = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;

  @media (min-width: ${DEVICE_SIZE.TABLET}) {
    display: none;
  }
`

export const Sidebar = memo(({ headline, items, ...props }) => {
  const location = useLocation()

  const activePath = useMemo(() => {
    return items.find(({ path }) => matchPath(location?.pathname, { path: path, exact: true }))?.label ?? ''
  }, [location, items])

  return (
    <Container {...props}>
      <Breadcrumb>
        <Text size="m" weight="regular" variant="ntrl_dark">
          {headline} /{' '}
          <Text size="m" weight="medium" variant="ntrl_darkt" as="span">
            {activePath}
          </Text>
        </Text>
      </Breadcrumb>
      <Content>
        <Text size="xl" weight="light" variant="ntrl_dark">
          {headline}
        </Text>

        <List>
          {items.map((item) => {
            const isActive = matchPath(location?.pathname, { path: item.path, exact: true })
            return (
              <SidebarLink key={item.path} to={item.path} count={item.notifications} isActive={isActive}>
                {item.label}
              </SidebarLink>
            )
          })}
        </List>
      </Content>
    </Container>
  )
})

Sidebar.defaultProps = {
  items: [],
}

Sidebar.displayName = 'Sidebar'
