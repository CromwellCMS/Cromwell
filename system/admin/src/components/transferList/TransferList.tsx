import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import { TextButton } from '../buttons/TextButton';
import { CheckList } from './CheckList';
import { intersection, not } from './helpers';
import styles from './TransferList.module.scss';

export default function TransferList(props: {
  left: string[];
  setLeft: (data: string[]) => void;
  right: string[];
  setRight: (data: string[]) => void;
  itemComp?: React.ComponentType<{ value: string }>;
  text?: {
    choices?: string;
    chosen?: string;
  };
  classes?: {
    checklist?: string;
    root?: string;
  };
}) {
  const [checked, setChecked] = React.useState<string[]>([]);
  const { left, setLeft, right, setRight, text } = props;

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      className={clsx(styles.root, props.classes?.root)}
    >
      <Grid item sx={{ mb: 'auto' }}>
        <CheckList
          title={text?.choices ?? 'Choices'}
          items={left}
          checked={checked}
          setChecked={setChecked}
          itemComp={props.itemComp}
          className={props.classes?.checklist}
        />
      </Grid>
      <Grid item className={styles.buttonsContainer}>
        <TextButton
          variant="outlined"
          className={styles.button}
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
        >
          <ArrowForwardIosIcon style={{ width: '1rem', height: '1rem' }} />
        </TextButton>
        <TextButton
          variant="outlined"
          className={styles.button}
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
        >
          <ArrowBackIosNewIcon style={{ width: '1rem', height: '1rem' }} />
        </TextButton>
      </Grid>
      <Grid item sx={{ mb: 'auto' }}>
        <CheckList
          title={text?.chosen ?? 'Chosen'}
          items={right}
          checked={checked}
          setChecked={setChecked}
          itemComp={props.itemComp}
          className={props.classes?.checklist}
        />
      </Grid>
    </Grid>
  );
}
