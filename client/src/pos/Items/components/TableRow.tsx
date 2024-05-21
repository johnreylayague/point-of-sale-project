import { Product } from "../../../shared/types/api/products";
import { Link } from "react-router-dom";
import SelectOption from "./SelectOption";
import { Category } from "../../../shared/types/api/categories";

type TableRowProps = {
  Product: Product;
  Categories: Category[];
  errorMsg: (errorMsg: string[] | string) => void;
  productsSet: (product: Product) => void;
};

const TableRow: React.FC<TableRowProps> = ({
  Product,
  Categories,
  errorMsg,
  productsSet,
}) => {
  const handleChangeCheckbox = () => {
    productsSet({ ...Product, isChecked: !Product.isChecked });
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          data-product-id={Product.id}
          checked={Product.isChecked}
          onChange={handleChangeCheckbox}
        />
      </td>
      <td>
        <Link to={`edit/${Product.id}`}>{Product.Name}</Link>
      </td>
      <td>
        <SelectOption
          errorMsg={errorMsg}
          Categories={Categories}
          CategoryId={Product.CategoryId}
          ProductId={Product.id}
        />
      </td>
      <td>{Product.Price.$numberDecimal}</td>
      <td>{Product.Cost.$numberDecimal}</td>
      <td>{!Product.TrackStock ? "-" : Product.InStock}</td>
    </tr>
  );
};

export default TableRow;
