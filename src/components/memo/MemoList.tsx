import { MemoModel } from '../../types';
import { MemoView } from './MemoView';
import { Typography, TypographyType } from 'chooui';
import styled from 'styled-components';

const NoMemosTypography = styled(Typography)``;

export const MemoList = ({
    memos,
    className,
    onMemoSelect,
    selectedMemoId,
}: {
    memos: MemoModel[];
    className?: string;
    onMemoSelect: (id: string) => void;
    selectedMemoId?: string;
}) => {
    return (
        <div className={className}>
            {(!memos || !memos.length) && (
                <>
                    <NoMemosTypography type={TypographyType.BodyLarge}>
                        You don't have any memos
                    </NoMemosTypography>
                </>
            )}
            {!!memos && !!memos.length && (
                <div>
                    {memos.map(({ id, text, date }) => (
                        <MemoView
                            selected={id === selectedMemoId}
                            key={id}
                            id={id}
                            text={text}
                            date={date}
                            onClick={onMemoSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
