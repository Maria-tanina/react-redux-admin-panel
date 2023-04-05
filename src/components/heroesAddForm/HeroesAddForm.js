import { useCallback, useState, useEffect } from "react";
import { heroCreated } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { v4 as uuidv4 } from "uuid";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const [heroName, setName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElem, setHeroElem] = useState('');
    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const {request} = useHttp();
    const dispatch = useDispatch();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElem
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch(() => console.log('error'))
        setName('');
        setHeroDescr('');
        setHeroElem('');
    }

    const renderFilters = (filters, status) => {
        if(status === 'loading') {
            return <option>Loading</option>
        } else if(status === 'error') {
            return <option>Error</option>
        }

        if(filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if(name === 'all') return
                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    value={heroName}
                    onChange={(e) => setName(e.target.value)}
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    value={heroElem}
                    onChange={(e) => setHeroElem(e.target.value)}
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;