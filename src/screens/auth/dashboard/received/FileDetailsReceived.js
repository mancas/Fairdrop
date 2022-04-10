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
import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/macro'
import { DEVICE_SIZE } from '../../../../theme/theme'
import { FileDetails } from '../../../../components'

const enterTimeout = 500
const exitTimeout = 250
const enterWidth = '320px'
const exitWidth = '0'

const FileDetailsStyled = styled(FileDetails)``

const WrapperDetails = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: white;
  @media (min-width: ${DEVICE_SIZE.TABLET}) {
    position: static;
    top: unset;
    right: unset;
    bottom: unset;
    left: unset;

    ${FileDetailsStyled} {
      width: ${enterWidth};
    }

    &.wrapper-details-enter {
      width: ${exitWidth};
    }

    &.wrapper-details-enter-active {
      width: ${enterWidth};
      transition: width ${enterTimeout}ms ease-in;
    }

    &.wrapper-details-enter-done {
      width: ${enterWidth};
    }

    &.wrapper-details-exit {
      width: ${enterWidth};
    }

    &.wrapper-details-exit-active {
      width: ${exitWidth};
      transition: width ${exitTimeout}ms ease-out;
    }

    &.wrapper-details-exit-done {
      width: ${exitWidth};
    }
  }
`

export const FileDetailsReceived = ({ show: givenShow, fileDetails, onExited }) => {
  const [{ show }, setState] = useState({ show: false, blockUI: false })

  const handleExited = () => onExited?.()

  const handleCloseFile = () => {
    setState((old) => ({ ...old, show: false }))
  }

  useEffect(() => {
    if (givenShow !== show) {
      setState((old) => ({ ...old, show: givenShow }))
    }
  }, [givenShow])

  return (
    <CSSTransition
      in={show}
      timeout={{
        enter: enterTimeout,
        exit: exitTimeout,
      }}
      classNames={{
        enter: 'wrapper-details-enter',
        enterActive: 'wrapper-details-enter-active',
        enterDone: 'wrapper-details-enter-done',
        exit: 'wrapper-details-exit',
        exitActive: 'wrapper-details-exit-active',
        exitDone: 'wrapper-details-exit-done',
      }}
      onExited={handleExited}
    >
      <WrapperDetails>
        {fileDetails && (
          <FileDetailsStyled
            from={fileDetails.from}
            file={fileDetails.file}
            when={fileDetails.time}
            link="wwww.fakelink.org"
            onClose={handleCloseFile}
          />
        )}
      </WrapperDetails>
    </CSSTransition>
  )
}
