import bcrypt from 'bcryptjs';

export type IVerifyPasswordProps = {
  hash: string;
  password: string;
};

export const verifyPassword = async (props: IVerifyPasswordProps) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(props.password, props.hash, (err, res) => {
      if (err) {
        console.log('000', err);
        reject(err);
      }
      resolve(res);
    });
  });
};
