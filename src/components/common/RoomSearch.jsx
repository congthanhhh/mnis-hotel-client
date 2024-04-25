import React, { useState } from 'react';
import moment from 'moment';
import { getAvailableRooms } from '../utils/ApiFunctions';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import RoomTypeSelector from './RoomTypeSelector';
import RoomSearchResults from './RoomSearchResults';

const RoomSearch = () => {
    const [searchQuery, setSearchQuery] = useState({
        checkInDate: '',
        checkOutDate: '',
        roomType: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const checkIn = moment(searchQuery.checkInDate);
        const checkOut = moment(searchQuery.checkOutDate);
        if (!checkIn.isValid() || !checkOut.isValid()) {
            setErrorMessage('Please, enter valid date range');
            return;
        }
        if (!checkOut.isSameOrAfter(checkIn)) {
            setErrorMessage('Check-In Date must come before Check-Out Date');
            return;
        }
        setIsLoading(true);
        getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, searchQuery.roomType)
            .then((response) => {
                setAvailableRooms(response.data);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery({ ...searchQuery, [name]: value });
        const checkInDate = moment(searchQuery.checkInDate);
        const checkOutDate = moment(searchQuery.checkOutDate);
        if (checkInDate.isValid() && checkOutDate.isValid()) {
            setErrorMessage('');
        }
    };
    const handleClearSearch = () => {
        setSearchQuery({
            checkInDate: '',
            checkOutDate: '',
            roomType: '',
        });
        setAvailableRooms([]);
    };

    return (
        <>
            <Container className="shadow mt-5 mb-5 py-5">
                <Form onSubmit={handleSearch}>
                    <Row className="justify-content-center">
                        <Col xs={12} md={3}>
                            <Form.Group controlId="checkInDate">
                                <Form.Label>Check In Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="checkInDate"
                                    value={searchQuery.checkInDate}
                                    onChange={handleInputChange}
                                    min={moment().format('YYYY-MM-DD')}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group controlId="checkOutDate">
                                <Form.Label>Check Out Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="checkOutDate"
                                    value={searchQuery.checkOutDate}
                                    onChange={handleInputChange}
                                    min={moment().format('YYYY-MM-DD')}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group controlId="RoomType">
                                <Form.Label>Room Type</Form.Label>
                                <div className="d-flex">
                                    <RoomTypeSelector handelRoomInputChange={handleInputChange} newRoom={searchQuery} />
                                    <Button variant="secondary" type="submit" className="ml-2">
                                        Search
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                {isLoading ? (
                    <p className="mt-4">Finding available rooms...</p>
                ) : availableRooms ? (
                    <RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch} />
                ) : (
                    <p className="mt-4">No rooms available for the selected dates and room type.</p>
                )}
                {errorMessage && <p>{errorMessage}</p>}
            </Container>
        </>
    );
};

export default RoomSearch;
