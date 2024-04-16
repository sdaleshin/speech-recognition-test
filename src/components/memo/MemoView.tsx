import { MemoModel } from '../../types';
import styled from 'styled-components';
import { Colors, Typography, TypographyType } from 'chooui';

const ContainerDiv = styled.div<{ selected: boolean }>`
    border: 1px solid rgb(226, 226, 228);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px;
    border-radius: 8px;
    cursor: pointer;
    padding: 24px;
    margin-top: 16px;
    background: ${(p) => (p.selected ? Colors.Gray95 : Colors.White)};
`;

const DateTypography = styled(Typography)`
    display: block;
    margin-bottom: 4px;
`;

export const MemoView = ({
    id,
    text,
    date,
    onClick,
    selected,
}: MemoModel & { onClick: (id: string) => void; selected: boolean }) => {
    return (
        <ContainerDiv onClick={() => onClick(id)} selected={selected}>
            <DateTypography type={TypographyType.PreTitle}>
                {date}
            </DateTypography>
            <Typography type={TypographyType.Body}>
                {text.slice(0, 50)}
            </Typography>
        </ContainerDiv>
    );
};
