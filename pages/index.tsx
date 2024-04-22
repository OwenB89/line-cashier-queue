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

    function renderHidden (queues) {
        const displayed = queues.slice(0,3);
        const hidden = queues.length - 3;
        return(
            <>
                {displayed.map((item,index) => (
                    <Card key={index} className='rounded-full w-24 h-24 flex items-center justify-center text-center border-2 border-black mx-auto my-2.5 font-bold text-black'>
                        <p>{item}</p>
                    </Card>
                ))}

                {hidden > 0 && <div className='rounded-full w-24 h-24 flex items-center justify-center text-center border-2 border-black mx-auto my-2.5 font-bold text-black'>...{hidden} more people in line.</div>}
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

            <Row gutter={[256, 16]}>
                {queues.map(( name,index) => (
                    <Col key={index} xs={24} sm={12} md={8} className="relative mr-[-1px]">
                        <Card title={<div className="border-b-2 border-black border-2 rounded-[25px] pt-[50px] pb-[50px] text-center p-3">
                            {`Cashier #${index + 1}`}</div>} bordered={false}>
                            {queues[index] && renderHidden(queues[index])}
                        </Card>
                        <div className="absolute right-0 top-0 bottom-0 w-[5px] rounded-full bg-gray-400"></div>
                    </Col>
                ))}
            </Row>
            <Divider className='my-5 h-[5px] bg-gray-400 rounded-[25px]'/>

            <Row className='mx-auto w-1/2 border border-3 border-400 border-black p-2.5 rounded-[25px] items-center'>
                <Col className='ml-5'>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <Space direction="vertical" size={"small"} style={{ display: 'flex' }}>
                            <Row>
                                <Col>
                                    <Controller 
                                        name="queue"
                                        control={control}
                                        render={({ field }) => <Input id="name" placeholder="Name"
                                            addonBefore="Name:" {...field} />} 
                                          />
                                    {errors.queue && <p className="text-red-500">{errors.queue.message}</p>}
                                </Col>
                            </Row>
                            <Button type="primary" htmlType="submit" className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded flex items-center justify-center">Enter Line</Button>
                        </Space>
                    </form>
                </Col>

                <Col className='ml-[100px]'>
                    <Row>
                        <Button className="m-[5px] text-green-500 border border-green-500" onClick={() => onClickDeleteLine(0)}>Handle Cashier #1</Button>
                    </Row>
                    <Row>
                        <Button className="m-[5px] text-green-500 border border-green-500" onClick={() => onClickDeleteLine(1)}>Handle Cashier #2</Button>
                    </Row>
                    <Row>
                        <Button className="m-[5px] text-green-500 border border-green-500" onClick={() => onClickDeleteLine(2)}>Handle Cashier #3</Button>
                    </Row>
                </Col>
            </Row>
        </div>
        
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
