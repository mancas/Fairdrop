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

import React, { useEffect } from 'react'
import { Route, Redirect, NavLink } from 'react-router-dom'
import { colors } from '../../../config/colors'
import { routes } from '../../../config/routes'
import { useTheme } from '../../../hooks/theme/useTheme'
import DashboardReceivedScreen from '../../../screens/auth/dashboard/received/DashboardReceivedScreen'
import Text from '../../atoms/text/Text'
import styles from './Dashboard.module.css'

const Dashboard = ({ history }) => {
  const { setVariant, setBackground } = useTheme()

  useEffect(() => {
    setVariant('black')
    setBackground(colors.white)
  }, [])

  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <NavLink className={styles.link} to={routes.mailbox.received}>
          <Text element="span" variant="black">
            {'> Received'}
          </Text>
        </NavLink>

        <NavLink className={styles.link} to={routes.mailbox.sent}>
          <Text element="span" variant="black">
            {'> Sent'}
          </Text>
        </NavLink>

        <NavLink className={styles.link} to={routes.mailbox.consents}>
          <Text element="span" variant="black">
            {'> Consents'}
          </Text>
        </NavLink>
      </nav>
      <div className={styles.content}>
        <Route exact path={routes.mailbox.received} component={DashboardReceivedScreen} />
        <Redirect exact path={routes.mailbox.dashboard} to={routes.mailbox.received} />
      </div>
    </div>
  )
}

export default React.memo(Dashboard)
