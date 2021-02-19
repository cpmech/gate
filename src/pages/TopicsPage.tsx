/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { isValidPositiveNumber } from '@cpmech/util';
import { RcReadyOrErrorPopup } from '../rcomps';
import { store, useStoreObserver } from '../service';

export interface TopicsPageProps {
  topicId: string;
  sectionId: string;
}

export const TopicsPage: React.FC<TopicsPageProps> = ({ topicId, sectionId }) => {
  const { error, ready } = useStoreObserver('TopicsPage');

  useEffect(() => {
    if (topicId) {
      store.loadTopic(topicId);
    }
  }, [topicId]);

  if (!ready) {
    return <RcReadyOrErrorPopup ready={ready} error={error} onClose={() => store.navigate()} />;
  }

  if (!isValidPositiveNumber(sectionId || '')) {
    return (
      <RcReadyOrErrorPopup
        ready={false}
        error="SectionId number is invalid"
        onClose={() => store.navigate()}
      />
    );
  }

  return (
    <div
      css={css`
        background-color: #ffffff;
        margin: 60px 20px;
        font-size: 1.3em;
      `}
    >
      <h1>TOPIC</h1>

      <p>Work in progress...</p>

      <p>{`topicId = "${topicId}"`}</p>
      <p>{`sectionId = "${sectionId}"`}</p>
    </div>
  );
};
