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

import { Empty } from 'antd';
import { BoardConfigContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardConfigProvider';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetWrapProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetWrapProvider';
import { LAYOUT_COLS_MAP } from 'app/pages/DashBoardPage/constants';
import useAutoBoardRenderItem from 'app/pages/DashBoardPage/hooks/useAutoBoardRenderItem';
import useGridLayoutMap from 'app/pages/DashBoardPage/hooks/useGridLayoutMap';
import {
  selectLayoutWidgetInfoMapById,
  selectLayoutWidgetMapById,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import { BoardState } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getBoardMarginPadding } from 'app/pages/DashBoardPage/utils/board';
import { memo, useCallback, useContext, useMemo } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import styled from 'styled-components/macro';
import StyledBackground from '../components/StyledBackground';
import { WidgetOfAuto } from './WidgetOfAuto';

const ReactGridLayout = WidthProvider(RGL);
export const AutoBoardCore: React.FC<{ boardId: string }> = memo(
  ({ boardId }) => {
    const { editing } = useContext(BoardContext);
    const boardConfig = useContext(BoardConfigContext);
    const { margin, background, allowOverlap } = boardConfig;
    const selectLayoutWidgetsConfigById = useMemo(
      selectLayoutWidgetMapById,
      [],
    );
    const layoutWidgetMap = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetsConfigById(state, boardId),
    );

    const layoutWidgetInfoMap = useSelector((state: { board: BoardState }) =>
      selectLayoutWidgetInfoMapById(state, boardId),
    );

    const sortedLayoutWidgets = useMemo(
      () =>
        Object.values(layoutWidgetMap).sort(
          (a, b) => a.config.index - b.config.index,
        ),

      [layoutWidgetMap],
    );

    const {
      ref,
      gridWrapRef,
      currentLayout,
      widgetRowHeight,
      throttleLazyRender,
      colsKey,
    } = useAutoBoardRenderItem(layoutWidgetInfoMap, margin);

    const { curMargin, curPadding } = useMemo(() => {
      return getBoardMarginPadding(boardConfig, colsKey);
    }, [boardConfig, colsKey]);
    const layoutMap = useGridLayoutMap(layoutWidgetMap);

    const onLayoutChange = useCallback(
      (layouts: Layout[]) => {
        throttleLazyRender();
        currentLayout.current = layouts;
      },
      [currentLayout, throttleLazyRender],
    );

    const boardChildren = useMemo(() => {
      return sortedLayoutWidgets.map(item => {
        return (
          <div key={item.id}>
            <WidgetWrapProvider
              id={item.id}
              boardEditing={editing}
              boardId={boardId}
            >
              <WidgetOfAuto />
            </WidgetWrapProvider>
          </div>
        );
      });
    }, [boardId, editing, sortedLayoutWidgets]);
    return (
      <Wrap>
        <StyledContainer bg={background}>
          {sortedLayoutWidgets.length ? (
            <div className="grid-wrap" ref={gridWrapRef}>
              <div ref={ref}>
                <ReactGridLayout
                  layout={layoutMap[colsKey]}
                  margin={curMargin}
                  containerPadding={curPadding}
                  cols={LAYOUT_COLS_MAP[colsKey]}
                  rowHeight={widgetRowHeight}
                  onLayoutChange={onLayoutChange}
                  isDraggable={false}
                  isResizable={false}
                  allowOverlap={allowOverlap}
                  measureBeforeMount={false}
                  useCSSTransforms={true}
                >
                  {boardChildren}
                </ReactGridLayout>
              </div>
            </div>
          ) : (
            <div className="empty">
              <Empty description="" />
            </div>
          )}
        </StyledContainer>
      </Wrap>
    );
  },
);

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
`;
const StyledContainer = styled(StyledBackground)`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  .grid-wrap {
    flex: 1;
    overflow-y: auto;
    -ms-overflow-style: none;
  }
  .grid-wrap::-webkit-scrollbar {
    width: 0 !important;
  }

  .empty {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
`;
