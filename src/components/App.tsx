import styled from 'styled-components';

import {
    ButtonColorEnum,
    ButtonSizeEnum,
    ButtonVariantEnum,
    GlobalStyle,
    Typography,
    TypographyType,
    Button,
} from 'chooui';
import { recognition, RecognitionCommands } from './recognition';
import { MemoList } from './memo/MemoList';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addItem,
    addNewMemoText,
    clearNewMemo,
    createNewMemo,
    deleteItem,
    editItem,
    selectMemos,
    selectNewMemo,
} from '../redux/memo.slice';
import { MemoEdit } from './memo/MemoEdit';
import { MemoModel } from '../types';
import { generateId } from '../utils/generateId';

const ContainerDiv = styled.div`
    margin: 0 auto;
    padding: 32px 64px 64px;
`;

const TitleTypography = styled(Typography)`
    display: block;
`;

const HeadRowDiv = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 32px;
`;

const HeadButton = styled(Button)`
    margin-left: 24px;
    width: 160px !important;
`;

const TwoColumnsDiv = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 48px;
`;

const StyledMemoList = styled(MemoList)`
    width: 50%;
`;

const StyledMemoEdit = styled(MemoEdit)`
    width: 50%;
`;

export function App() {
    const [voiceControlActivated, setVoiceControlActivated] = useState(false);
    const [selectedMemo, setSelectedMemo] = useState<MemoModel>(null);
    const memos = useSelector(selectMemos);
    const newMemo = useSelector(selectNewMemo);
    const memoToEdit = newMemo || selectedMemo;
    const dispatch = useDispatch();

    const handleAddMemo = () => {
        dispatch(createNewMemo());
    };

    const handleActivateVoiceControl = () => {
        setVoiceControlActivated(true);
        recognition.start();
    };

    const handleStopVoiceControl = () => {
        setVoiceControlActivated(false);
        recognition.stop();
    };

    const handleSaveMemo = (newText: string) => {
        if (!memoToEdit.id) {
            const memoToCreate = {
                id: generateId(),
                text: newText,
                date: memoToEdit.date,
            };
            dispatch(addItem(memoToCreate));
            dispatch(clearNewMemo());
            setSelectedMemo(memoToCreate);
        } else {
            const updatedMemo = {
                ...memoToEdit,
                text: newText,
            };
            dispatch(
                editItem({
                    ...memoToEdit,
                    text: newText,
                }),
            );
            setSelectedMemo(updatedMemo as MemoModel);
        }
    };

    const handleMemoSelect = (id: string) => {
        setSelectedMemo(memos.find((memo) => memo.id === id));
        dispatch(clearNewMemo());
    };

    const handleMemoDelete = (id: string) => {
        dispatch(deleteItem(id));
        setSelectedMemo(memos.find((memo) => memo.id !== id));
    };

    useEffect(() => {
        recognition.onresult = (event) => {
            const transcript =
                event.results[event.results.length - 1][0].transcript.trim();
            if (
                transcript.toLowerCase().endsWith(RecognitionCommands.AddMemo)
            ) {
                handleAddMemo();
            } else if (
                transcript
                    .toLowerCase()
                    .endsWith(RecognitionCommands.SaveMemo) &&
                newMemo &&
                newMemo.text.trim() !== ''
            ) {
                handleSaveMemo(newMemo.text);
            } else if (newMemo) {
                dispatch(addNewMemoText(transcript));
            }
        };
    }, [newMemo, dispatch, handleSaveMemo, handleAddMemo]);

    return (
        <>
            <GlobalStyle />
            <ContainerDiv>
                <HeadRowDiv>
                    <TitleTypography type={TypographyType.H2}>
                        My Voice Memos
                    </TitleTypography>
                    <HeadButton
                        text="Add Memo"
                        onClick={handleAddMemo}
                        size={ButtonSizeEnum.Small}
                        color={ButtonColorEnum.Blue}
                        variant={ButtonVariantEnum.Outlined}
                    />
                    {!voiceControlActivated && (
                        <HeadButton
                            text="Voice Control"
                            onClick={handleActivateVoiceControl}
                            size={ButtonSizeEnum.Small}
                            color={ButtonColorEnum.Blue}
                            variant={ButtonVariantEnum.Outlined}
                        />
                    )}
                    {voiceControlActivated && (
                        <HeadButton
                            text="Stop Listening"
                            onClick={handleStopVoiceControl}
                            size={ButtonSizeEnum.Small}
                            color={ButtonColorEnum.Red}
                            variant={ButtonVariantEnum.Filled}
                        />
                    )}
                </HeadRowDiv>
                <TwoColumnsDiv>
                    <StyledMemoList
                        memos={memos}
                        onMemoSelect={handleMemoSelect}
                        selectedMemoId={selectedMemo?.id}
                    />
                    {!!memoToEdit && (
                        <StyledMemoEdit
                            id={memoToEdit.id}
                            text={memoToEdit.text}
                            onSave={handleSaveMemo}
                            date={memoToEdit.date}
                            onDelete={handleMemoDelete}
                        />
                    )}
                </TwoColumnsDiv>
            </ContainerDiv>
        </>
    );
}
