import styles from '../pages/Signup.module.css';

interface PasswordRequirementsProps {
    password: string;
}

function PasswordRequirements({ password }: PasswordRequirementsProps) {
    const requirements = [
        {test: password.length >= 8, text: 'Co najmniej 8 znaków'},
        {test: /[A-Z]/.test(password), text: 'Przynajmniej jedna wielka litera'},
        {test: /[a-z]/.test(password), text: 'Przynajmniej jedna mała litera'},
        {test: /[0-9]/.test(password), text: 'Przynajmniej jedna cyfra'},
        {test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'Przynajmniej jeden znak specjalny (!@#$%^&*...)'}
    ];

    return (
        <div className={styles.passwordRequirements}>
            <p>Wymagania dotyczące hasła:</p>
            <ul>
                {requirements.map((req, index) => (
                    <li
                        key={index}
                        style={{color: req.test ? '#4cae4f' : '#e74c3c'}}
                    >
                        {req.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default PasswordRequirements