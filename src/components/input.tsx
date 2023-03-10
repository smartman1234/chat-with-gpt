import styled from '@emotion/styled';
import { Button, ActionIcon, Textarea } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context';
import { useAppDispatch, useAppSelector } from '../store';
import { selectMessage, setMessage } from '../store/message';
import { selectTemperature } from '../store/parameters';
import { openSystemPromptPanel, openTemperaturePanel } from '../store/settings-ui';

const Container = styled.div`
    background: #292933;
    border-top: thin solid #393933;
    padding: 1rem 1rem 0 1rem;

    .inner {
        max-width: 50rem;
        margin: auto;
        text-align: right;
    }

    .settings-button {
        margin: 0.5rem -0.4rem 0.5rem 1rem;
        font-size: 0.7rem;
        color: #999;
    }
`;

export declare type OnSubmit = (name?: string) => Promise<boolean>;

function PaperPlaneSubmitButton(props: { onSubmit: any, disabled?: boolean }) {
    return (
        <ActionIcon size="sm"
            disabled={props.disabled}
            loading={props.disabled}
            onClick={props.onSubmit}>
            <i className="fa fa-paper-plane" style={{ fontSize: '90%' }} />
        </ActionIcon>
    );
}

export interface MessageInputProps {
    disabled?: boolean;
}

export default function MessageInput(props: MessageInputProps) {
    const temperature = useAppSelector(selectTemperature);
    const message = useAppSelector(selectMessage);
    
    const context = useAppContext();
    const dispatch = useAppDispatch();

    const onCustomizeSystemPromptClick = useCallback(() => dispatch(openSystemPromptPanel()), [dispatch]);
    const onTemperatureClick = useCallback(() => dispatch(openTemperaturePanel()), [dispatch]);
    const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setMessage(e.target.value));
    }, [dispatch]);

    const pathname = useLocation().pathname;

    const onSubmit = useCallback(async () => {
        if (await context.onNewMessage(message)) {
            dispatch(setMessage(''));
        }
    }, [context, message, dispatch]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.shiftKey === false && !props.disabled) {
            e.preventDefault();
            onSubmit();
        }
    }, [onSubmit, props.disabled]);

    const rightSection = useMemo(() => {
        return (
            <div style={{
                opacity: '0.8',
                paddingRight: '0.4rem',
            }}>
                <PaperPlaneSubmitButton onSubmit={onSubmit} disabled={props.disabled} />
            </div>
        );
    }, [onSubmit, props.disabled]);

    const messagesToDisplay = context.currentChat.messagesToDisplay;
    const disabled = context.generating
        || messagesToDisplay[messagesToDisplay.length - 1]?.role === 'user'
        || (messagesToDisplay.length > 0 && !messagesToDisplay[messagesToDisplay.length - 1]?.done);

    const isLandingPage = pathname === '/';
    if (context.isShare || (!isLandingPage && !context.id)) {
        return null;
    }

    return <Container>
        <div className="inner">
            <Textarea disabled={props.disabled || disabled}
                autosize
                minRows={3}
                maxRows={12}
                placeholder={"Enter a message here..."}
                value={message}
                onChange={onChange}
                rightSection={rightSection}
                onKeyDown={onKeyDown} />
            <div>
                <Button variant="subtle"
                    className="settings-button"
                    size="xs"
                    compact
                    onClick={onCustomizeSystemPromptClick}>
                    <span>Customize system prompt</span>
                </Button>
                <Button variant="subtle"
                    className="settings-button"
                    size="xs"
                    compact
                    onClick={onTemperatureClick}>
                    <span>Temperature: {temperature.toFixed(1)}</span>
                </Button>
            </div>
        </div>
    </Container>;
}