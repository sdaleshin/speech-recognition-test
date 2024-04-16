import { MemoModel } from '../../types';
import {
    Button,
    ButtonColorEnum,
    ButtonSizeEnum,
    ButtonVariantEnum,
    Colors,
    Typography,
    TypographyType,
} from 'chooui';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ButtonsRowDiv = styled.div`
    display: flex;
    margin-top: 16px;
    width: 100%;
    justify-content: space-between;
`;

const SaveCancelButtonsDiv = styled.div`
    display: flex;
    gap: 16px;
`;

const StyledTextArea = styled.textarea<{ $hasError: boolean }>`
    outline: none;
    padding: 24px;
    width: 100%;
    height: 300px;
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    border: 1px solid ${(p) => (p.$hasError ? Colors.Red60 : Colors.Gray90)};
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px;
    border-radius: 8px;
    box-sizing: border-box;
    color: rgb(58, 57, 64);
    margin-top: 4px;
`;

const ErrorTypography = styled(Typography)`
    color: ${Colors.Red60} !important;
    position: absolute;
    display: block;
    margin-top: -24px;
    margin-left: 16px;
`;

export const MemoEdit = ({
    id,
    text,
    date,
    onSave,
    onDelete,
    className,
}: Partial<MemoModel> & {
    onSave: (text: string) => void;
    onDelete: (id: string) => void;
    className?: string;
}) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleSaveClick = () => {
        const value = ref.current.value;
        if (value.trim() === '') {
            setErrorMessage('This field is required');
        } else {
            onSave(ref.current.value);
        }
    };
    const handleCancelClick = () => {
        ref.current.value = text;
    };

    const handleKeyDown = () => {
        setErrorMessage('');
    };

    const handleDeleteClick = () => {
        onDelete(id);
    };

    useEffect(() => {
        ref.current.value = text;
        setErrorMessage('');
    }, [text]);

    return (
        <div className={className}>
            <Typography type={TypographyType.PreTitle}>
                {id ? date : 'NEW MEMO'}
            </Typography>
            <StyledTextArea
                ref={ref}
                defaultValue={text}
                $hasError={!!errorMessage}
                onKeyDown={errorMessage ? handleKeyDown : undefined}
            />
            {!!errorMessage && (
                <ErrorTypography type={TypographyType.BodySmall}>
                    {errorMessage}
                </ErrorTypography>
            )}
            <ButtonsRowDiv>
                <SaveCancelButtonsDiv>
                    <Button
                        text={'Save'}
                        color={ButtonColorEnum.Blue}
                        variant={ButtonVariantEnum.Filled}
                        size={ButtonSizeEnum.Regular}
                        onClick={handleSaveClick}
                    />
                    <Button
                        text={'Cancel'}
                        color={ButtonColorEnum.Gray}
                        variant={ButtonVariantEnum.Outlined}
                        size={ButtonSizeEnum.Regular}
                        onClick={handleCancelClick}
                    />
                </SaveCancelButtonsDiv>
                {!!id && (
                    <Button
                        text={'Delete'}
                        color={ButtonColorEnum.Red}
                        variant={ButtonVariantEnum.Text}
                        size={ButtonSizeEnum.Regular}
                        onClick={handleDeleteClick}
                    />
                )}
            </ButtonsRowDiv>
        </div>
    );
};
