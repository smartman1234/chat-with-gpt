import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import MessageInput from '../input';
import SettingsDrawer from '../settings';
import { useAppContext } from '../../context';
import { Page } from '../page';

const Container = styled.div`
    flex-grow: 1;
    padding-bottom: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Work Sans", sans-serif;
    line-height: 1.7;
    gap: 1rem;
`;

export default function LandingPage(props: any) {
    const context = useAppContext();

    return <Page id={'landing'} showSubHeader={true}>
        <Container>
            <p>Hello, how can I help you today?</p>
            {!context.apiKeys.openai && (
                <Button size="xs" variant="light" compact onClick={() => context.settings.open('user', 'openai-api-key')}>
                    Connect your OpenAI account to get started
                </Button>
            )}
        </Container>
    </Page>;
}
