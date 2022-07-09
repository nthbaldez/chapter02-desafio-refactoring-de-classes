// import { useEffect, useState } from 'react';

// import { Header } from '../../components/Header';
// import api from '../../services/api';
// import Food from '../../components/Food';
// import ModalAddFood from '../../components/ModalAddFood';
// import ModalEditFood from '../../components/ModalEditFood';
// import { FoodsContainer } from './styles';

// interface FoodProps {
//   available: boolean,
//   id: number,
//   image: string,
//   name: string,
//   description: string,
//   price: string,
// }

// interface AddFood {
//   image: string,
//   name: string,
//   description: string,
//   price: string,
// }

// export default function Dashboard() {

//   const [ modalOpen, setModalOpen ] = useState(false);
//   const [ foods, setFoods ] = useState<FoodProps[]>([]);
//   const [ editModalOpen, setEditModalOpen ] = useState(false);
//   const [ editingFood, setEditingFood ] = useState<FoodProps>({} as FoodProps);

//   useEffect(() => {
//     async function getFoods() {
//       try {
//         const response = await api.get('/user?ID=12345');
//         setFoods(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     getFoods();
//   })

//   async function handleAddFood(food: AddFood) {
//     try {
//       const response = await api.post('/foods', {
//         ...food,
//         available: true,
//       });

//       setFoods(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   function toggleModal() {
//     setModalOpen(!modalOpen);
//   }
  
//   function toggleEditModal() {
//     setEditModalOpen(!editModalOpen);
//   }

//   async function handleUpdateFood(food: AddFood) {

//     try {
//       const foodUpdated = await api.put(
//         `/foods/${editingFood.id}`,
//         { ...editingFood, ...food },
//       );

//       const foodsUpdated = foods.map((f: FoodProps) =>
//         f.id !== foodUpdated.data.id ? f : foodUpdated.data,
//       );

//       setFoods(foodsUpdated);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async function handleDeleteFood(id: number) {
//     await api.delete(`/foods/${id}`);

//     const foodsFiltered = foods.filter(food => food.id !== id);

//     setFoods(foodsFiltered);
//   }

//   function handleEditFood(food: FoodProps) {
//     // this.setState({ editingFood: food, editModalOpen: true });
//     setEditModalOpen(true);
//     setEditingFood(food);
//   }

//   return (
//     <>
//       <Header openModal={toggleModal} />
//       <ModalAddFood
//         isOpen={modalOpen}
//         setIsOpen={toggleModal}
//         handleAddFood={handleAddFood}
//       />
//       <ModalEditFood
//         isOpen={editModalOpen}
//         setIsOpen={toggleEditModal}
//         editingFood={editingFood}
//         handleUpdateFood={handleUpdateFood}
//       />

//       <FoodsContainer data-testid="foods-list">
//         {foods &&
//           foods.map(food => (
//             <Food
//               key={food.id}
//               food={food}
//               handleDelete={handleDeleteFood(food.id)}
//               handleEditFood={handleEditFood}
//             />
//           ))}
//       </FoodsContainer>
//     </>
//   );
// }

import { useEffect, useState } from 'react';

import { Header} from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id:number;
  name:string;
  description:string;
  price:string;
  available:boolean;
  image:string;
}

interface AddFood {
  image:string;
  name:string;
  price:string;
  description:string;
}

export default function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }
    getFoods()
  })

  
  async function handleAddFood(
    food: Omit<IFood, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: AddFood): Promise<void> => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id:number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen( !modalOpen );
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: IFood) => {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

}