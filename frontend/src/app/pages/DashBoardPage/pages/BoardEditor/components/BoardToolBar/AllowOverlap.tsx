/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { BlockOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardActionContext } from 'app/pages/DashBoardPage/contexts/BoardActionContext';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import React, { useContext } from 'react';

export const AllowOverlapBtn = () => {
  const { boardToggleAllowOverlap } = useContext(BoardActionContext);
  const {
    config: { allowOverlap },
  } = useContext(BoardConfigContext);
  const t = useI18NPrefix(`viz.board.action`);

  const onClick = () => {
    boardToggleAllowOverlap(!allowOverlap);
  };
  return (
    <Tooltip title={t('allowOverlap')}>
      <ToolbarButton onClick={onClick} icon={<BlockOutlined />} />
    </Tooltip>
  );
};
