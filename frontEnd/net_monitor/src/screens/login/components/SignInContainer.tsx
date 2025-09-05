import Stack from "@mui/material/Stack";
import styles from './SignInContainer.module.css';
import Card from "@mui/material/Card";
import { Logo } from "../../../assets/logo";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useI18n } from "../../../hooks/usei18n";
import LanguageSelector from "../../../components/LanguageSelector";

export type SignInContainerProps = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    validateInputs: () => boolean;
    emailError: boolean;
    emailErrorMessage: string;
    passwordError: boolean;
    passwordErrorMessage: string;
}

export default function SignInContainer(props: SignInContainerProps) {
    const { t } = useI18n();

    return (
        <Stack
            direction="column"
            justifyContent="space-between"
            className={styles.signInContainer}
        >
            <Card className={styles.loginCard} variant="outlined">
                <Stack>
                    <LanguageSelector />
                </Stack>
                <Stack>
                    <Logo fillColor='#fff' width='300' height='200' />
                </Stack>
                <Box
                    component="form"
                    onSubmit={props.handleSubmit}
                    noValidate
                    sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={props.emailError}
                            helperText={props.emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={props.emailError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={props.passwordError}
                            helperText={props.passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={props.passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={props.validateInputs}
                    >
                        {t('loginPage.signIn')}
                    </Button>
                </Box>
            </Card>
        </Stack>
    );
}