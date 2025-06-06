import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { FiPlus } from "react-icons/fi";
import { Container, Brand, Menu, Search, Content, NewNote } from "./styles";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Note } from "../../components/Note";
import { Section } from "../../components/Section";
import { ButtonText } from "../../components/ButtonText";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

export function Home() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const navigate = useNavigate();

  function handleTagSelected(tagName) {
    if (tagName === "all") {
      return setTagsSelected([]);
    }
    const alreadySelected = tagsSelected.includes(tagName);

    if (alreadySelected) {
      const filteredTags = tagsSelected.filter((tag) => tag !== tagName);
      setTagsSelected(filteredTags);
    } else {
      setTagsSelected((prevState) => [...prevState, tagName]);
    }
  }

  function handleDetails(id) {
    navigate(`./details/${id}`);
  }
  useEffect(() => {
    async function fetchTags() {
      const response = await api.get("/tags");
      setTags(response.data);
    }
    fetchTags();
  }, []);

  useEffect(() => {
    async function fetchNotes() {
      const response = await api.get(
        `/notes?title=${search}&tags=${tagsSelected.join(",")}`
      );
      setNotes(response.data);
    }
    fetchNotes();
  }, [tagsSelected, search]);

  return (
    <Container>
      <div className="sidebar">
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? (
            <IoIosArrowBack size={32} />
          ) : (
            <IoIosArrowForward size={32} />
          )}
        </button>

        <div className={`sidebar-content ${!showSidebar ? "hide" : ""}`}>
          <Brand>
            <h1>NoteLinks</h1>
          </Brand>
          <Menu>
            <li>
              <ButtonText
                title="Todos"
                onClick={() => handleTagSelected("all")}
                $isActive={tagsSelected.length === 0}
              />
            </li>
            {tags &&
              tags.map((tag) => (
                <li key={String(tag.id)}>
                  <ButtonText
                    title={tag.name}
                    onClick={() => handleTagSelected(tag.name)}
                    $isActive={tagsSelected.includes(tag.name)}
                  />
                </li>
              ))}
          </Menu>
          <NewNote to="/New">
            <FiPlus />
            Ciar nota
          </NewNote>
        </div>
      </div>

      <div className="main">
        <Header />

        <Search>
          <Input
            placeholder="Pesquisar pelo título"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Search>

        <Content>
          <Section title="Minhas notas">
            {notes.map((note) => (
              <Note
                key={String(note.id)}
                data={note}
                onClick={() => handleDetails(note.id)}
              />
            ))}
          </Section>
        </Content>
      </div>
    </Container>
  );
}
