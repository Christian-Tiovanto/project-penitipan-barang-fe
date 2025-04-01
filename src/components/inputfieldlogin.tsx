interface InputFieldLoginProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    error?: string;
}

const InputFieldLogin: React.FC<InputFieldLoginProps> = ({ type, placeholder, value, onChange, icon, error }) => {
    return (
        <div>
            <div className="position-relative">
                <input
                    type={type}
                    className="form-control form-control-lg border-secondary shadow-none pe-5 rounded-0 border-2"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                />
                {icon && (
                    <span
                        className="position-absolute top-50 end-0 translate-middle-y text-muted d-flex align-items-center"
                        style={{ fontSize: '1.3rem', paddingRight: '10px' }}
                    >
                        {icon}
                    </span>
                )}
            </div>
            {error && <div className="text-danger mt-1">{error}</div>}
        </div>
    );
};

export default InputFieldLogin;