import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { ArticleStateType, OptionType } from '@/constants/articleProps';
import type { FormEvent } from 'react';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (settings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent): void => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return (): void => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleForm = (): void => setIsOpen((previousIsOpen) => !previousIsOpen);

  const changeSetting = (name: keyof ArticleStateType, option: OptionType): void => {
    setFormState((previousState) => ({ ...previousState, [name]: option }));
  };

  const applySettings = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  const resetSettings = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <div ref={rootRef}>
      <ArrowButton isOpen={isOpen} onClick={toggleForm} />
      <aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form className={styles.form} onSubmit={applySettings} onReset={resetSettings}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={(option) => changeSetting('fontFamilyOption', option)}
          />
          <RadioGroup
            title="Размер шрифта"
            name="fontSize"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={(option) => changeSetting('fontSizeOption', option)}
          />
          <Select
            title="Цвет шрифта"
            options={fontColors}
            selected={formState.fontColor}
            onChange={(option) => changeSetting('fontColor', option)}
          />
          <Separator />
          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={(option) => changeSetting('backgroundColor', option)}
          />
          <Select
            title="Ширина контента"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={(option) => changeSetting('contentWidth', option)}
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
