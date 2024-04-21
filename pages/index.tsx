import queueListAtom from '@/data/Queue';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import { Row, Col, Card, Divider, Space, Button, Input } from 'antd';
import { useAtom } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';

const IndexPage: Page = () => {

    const [queues, setQueue] = useAtom(queueListAtom);

    function renderHidden (queues: string[]) {
        const displayed = queues.slice(0,3);
        const hidden = queues.length - 3;
        return(
            <>
                {displayed.map((item,index) => (
                    <Card key={index} className='circleItem'>
                        <p>{item}</p>
                    </Card>
                ))}

                {hidden > 0 && <div className='circleItem'>...{hidden} more people in line.</div>}
            </>
        )
    }

    function onFormSubmit(formData) {
        const num = Math.floor(Math.random() * 3);
        const newList = queues.slice(0);
        newList[num]?.push(formData.queue);

        setQueue(newList);

        reset();
    }

    function onClickDeleteLine(index){
        const newList = queues.slice(0);
        newList[index]?.shift();
        console.log(newList);

        setQueue(newList);
    }

    const CreateNameFormSchema = z.object({
        queue: z.string().nonempty({ message: 'Name is required.' })
            .max(50, { message: 'Name must be less than 50 characters.' })
            .refine((value)=> !queues.some(row => row.includes(value)), { message: 'Name cannot be a duplicate.' })
    });

    type CreateNameFormType = z.infer<typeof CreateNameFormSchema>;

    const { handleSubmit, control, formState: { errors }, reset } = useForm<CreateNameFormType>({
        resolver: zodResolver(CreateNameFormSchema),
        mode: 'onChange'
    });

    return (
        <div>
            <Title>Home</Title>
            Hello World!

            <Row gutter={[256, 16]}>
                {queues.map(( name,index) => (
                    <Col key={index} xs={24} sm={12} md={8} className="dividerCol">
                        <Card title={`Queue #${index + 1}`} className="customCard" style={{borderWidth: 0}}>
                            {queues[index] && renderHidden(queues[index])}
                        </Card>
                    </Col>
                ))}
            </Row>
            <Divider style={{ margin: '20px 0', height: '5px', backgroundColor: 'gray', borderRadius: 25 }}/>

            <Row className='center'>
                <Col>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <Space direction="vertical" size={"small"} style={{ display: 'flex' }}>
                            <Row>
                                <Col>
                                    <Controller 
                                        name="queue"
                                        control={control}
                                        render={({ field }) => <Input id="name" placeholder="Product Name"
                                            addonBefore="Product Name" {...field} />} 
                                          />
                                    {errors.queue && <span className="text-red-500">{errors.queue.message}</span>}
                                </Col>
                            </Row>
                            <Button type="primary" htmlType="submit" className="bg-blue-500">Enter Line</Button>
                        </Space>
                    </form>
                </Col>

                <Col>
                    <Row>
                        <Button className="bg-red-500" onClick={() => onClickDeleteLine(0)}>Handle Cashier #1</Button>
                    </Row>
                    <Row>
                        <Button className="bg-red-500" onClick={() => onClickDeleteLine(1)}>Handle Cashier #2</Button>
                    </Row>
                    <Row>
                        <Button className="bg-red-500" onClick={() => onClickDeleteLine(2)}>Handle Cashier #3</Button>
                    </Row>
                </Col>
            </Row>
        </div>
        
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
