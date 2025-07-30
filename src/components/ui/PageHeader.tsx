type Props = {
  title: string;
};

export const Header: React.FC<Props> = ({ title }) => <h1 className="text-2xl font-bold">{title}</h1>;

export default Header;
